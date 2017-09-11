class PeAEvent{
    /**
     * recommend extend this class, direct construct will throw an error
     * @param {boolean} [asTools] - if you really want just construct it, call with true
     * */
    constructor(asTools=false){
        this._events ={};
        if(new.target===PeAEvent &&asTools!==true){
            throw new TypeError('PeAEvent must be extend');
        }
    };
    /**
     * listen a event, add a listener for event
     * @param {string} eventType - "*" means all
     * @param {function} listener
     * @param {Object} [options]
     * @param {boolean} options.once -  If true, the listener would be automatically removed when invoked.
     * */
    on(eventType,listener,{once}={}){
        if(typeof eventType!=='string'||typeof listener!=='function'){
            throw new TypeError('illegal call PeAEvent#on',...arguments);
        }
        var event =new PeAEvent.Event(listener);
        this.addEvent(eventType,event);

        if(once ===true){
            let that =this;
            event.setExec(function(){
                that.off(eventType ,listener);
                return listener(...arguments);
            });
        };
    };
    /**
     * listen a event but once.
     * it's alias for PeAEvent#on(eventType,listener,{once:true})
     * @param {string} eventType - "*" means all
     * @param {function} listener
     * @param {Object} [options]
     * */
    one(eventType,listener,options={}){
        var args =Array.from(arguments);
        args[2]=arguments[2]||{};
        args[2].once =true;
        return this.on(...args);
    };
    /**
     * remove a event listener.
     * > note: if you use * in listener, waiter will be remove too
     * @param {string} eventType
     * @param {function|string} listener - "*" means all
     * @return {boolean} success or no
     * */
    off(eventType,listener){
        var event =new PeAEvent.Event(listener);
        return this.removeEvent(eventType,event);
    };
    /**
     * wait a event.
     * you can add a checker, return a boolean to specify whether to wait
     * if return a true, promise will be resolve
     * @param {string} eventType - "*" means all
     * @param {function} [checker] - a checker function, it will call by event dispatch and received dispatch's argument, return a boolean for resolve or keep waiting
     * @return {Promise}
     * */
    wait(eventType ,checker=()=>true){
        return new Promise(resolve =>{
            var symbol = Symbol(`${eventType}.waiter`);
            var event = new PeAEvent.Event(symbol ,(...args) =>{
                if(checker(...args)){
                    this.off(eventType ,symbol);
                    resolve();
                };
            });
            this.addEvent(eventType ,event);
        });
    }
    /**
     * return the number of listeners for a given event type
     * @param {string} eventType
     * @return {Number}
     * */
    has(eventType){
        if(eventType in this._events){
            return this._events[eventType].length;
        }else{
            return 0;
        }
    }
    /**reset all event listener*/
    reset(){this._events ={}};
    /**
     * trigger a event, exec this event's listener all.
     * you can overwrite this method to changed you want,
     * but overwrite method should use PeAEvent#execListener(listener ,arguments ,eventType) to exec a listener.
     * @param {string} type - event name to trigger
     * @param {Array} args - passed argument
     * @return {Promise}
     * @abstract
     * */
    execEventAll(type,args=[]){
        if(!Array.isArray(args)){
            throw TypeError('PeAEvent#execEventAll second argument must be a array');
        };
        var promises =[];
        if(type in this._events){
            promises =this._events[type]
                .map(ce=>{
                    var val =this.execListener(ce.getExec(),args,type);
                    if([undefined,null].includes(val)){
                        return null;
                    }else{
                        return val;
                    };
                })
                .filter(v=>v!==null)
            ;
        };
        if('*' in this._events &&type!=='*'){
            this.execEventAll('*' ,...Array.from(arguments).slice(1));
        }
        if(promises.length===0)return Promise.resolve();
        else                   return Promise.race(promises);
    };
    /**
     * how call a event listener.
     * you can overwrite this method to changed you want.
     * @param {function} listener - event listener
     * @param {Array} args - the parameters passed in when the event is trigger
     * @param {string} eventType - the event name
     * @abstract
     * */
    execListener(listener,args,eventType){
        return listener(...args);
    };
};

// @private

/**
 * @param {string} type
 * @param {PeAEvent.Event} event
 * @private
 * */
PeAEvent.prototype.addEvent =function(type,event){
    if(!(type in this._events)){
        this._events[type] =[];
    };
    var index =this._events[type].findIndex(
        e=>e.getOrigin()===event.getOrigin()
    );
    if(~index){//if repeat, update event obj
        this._events[type][index] =event;
    }else{
        this._events[type].push(event);
    };
};
/**
 * @param {string} type
 * @param {PeAEvent.Event} event
 * @private
 * */
PeAEvent.prototype.removeEvent =function(type,event){
    if(!(type in this._events)){
        return false;
    };
    if(event.getOrigin() ==='*'){
        if(this._events[type].length!==0){
            delete this._events[type];
            return true;
        }else{
            return false;
        }
    };
    var index =this._events[type].findIndex(
        e=>e.getOrigin()===event.getOrigin()
    );
    if(~index){
        this._events[type].splice(index,1);
        return true;
    };
    return false;
};





PeAEvent.Event =class{
    constructor(originFn,execFn=originFn){
        this.originFn =originFn;
        this.execFn   =execFn;
    };
    getOrigin(){
        return this.originFn;
    };
    getExec(){
        return this.execFn;
    };
    setExec(fn){
        return this.execFn =fn;
    };
};

if(typeof module!=='undefined')module.exports=PeAEvent;