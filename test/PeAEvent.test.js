const Sinon =require('sinon');
const Assert =require('chai').assert;
const PeAEvent =require('../src/PeAEvent.js');

//private interface

/**@param {PeAEvent} peaEvent*/
const getEventRecord =function(peaEvent){
    return peaEvent._events;
};

describe('PeAEvent#constructor',function(){
    it('should throw an error without extend',function(){
        Assert.throws(function(){
            new PeAEvent();
        },TypeError);
    });
    it('if be extended, should not throw error',function(){
        Assert.doesNotThrow(function(){
            new class extends PeAEvent{};
        },TypeError);
    });
    it('input true can be used as tools without throw error',function(){
        var willThrowError =[false,,undefined,null,0,1,''];
        var willWroks =[true];

        willThrowError.forEach(value=>{
            Assert.throws(function(){
                new PeAEvent(value);
            },TypeError);
        });
        willWroks.forEach(value=>{
            Assert.doesNotThrow(function(){
                new PeAEvent(value);
            },TypeError);
        });
    });
});
describe('PeAEvent#on',function(){
    it('bind event should be directly reflected on internal property',function(){
        const PE =new PeAEvent(true);

        PE.on('click',console.log);
        Assert.lengthOf(getEventRecord(PE).click,1);
        Assert.equal(getEventRecord(PE).click[0].getOrigin(),console.log);

        PE.on('click',console.error);
        Assert.lengthOf(getEventRecord(PE).click,2);
        Assert.equal(getEventRecord(PE).click[1].getOrigin(),console.error);

        getEventRecord(PE).click.forEach(function(e){
            Assert.instanceOf(e ,PeAEvent.Event);
        });
    });
    it('bind event with {once:true} should wrap listener',function(){
        const PE =new PeAEvent(true);

        PE.on('click',console.log,{once:true});
        Assert.equal    (getEventRecord(PE).click[0].getOrigin(),console.log);
        Assert.notEqual (getEventRecord(PE).click[0].getExec()  ,console.log);

        getEventRecord(PE).click.forEach(function(e){
            Assert.instanceOf(e ,PeAEvent.Event);
        });
    });
    it('bind event with {once:true} should exec once',function(){
        const PE =new PeAEvent(true);

        PE.on('click',console.log,{once:true});
        Assert.lengthOf(getEventRecord(PE).click ,1);

        getEventRecord(PE).click[0].getExec()();
        Assert.lengthOf(getEventRecord(PE).click ,0);

    });
    it('auto filter repeat',function(){
        const PE =new PeAEvent(true);

        PE.on('click',console.log);
        Assert.lengthOf(getEventRecord(PE).click,1);

        PE.on('click',console.log);
        Assert.lengthOf(getEventRecord(PE).click,1);
        Assert.equal(getEventRecord(PE).click[0].getOrigin(),console.log);
        Assert.equal(getEventRecord(PE).click[0].getExec(),console.log);

        PE.on('click',console.log,{once:true});
        Assert.lengthOf(getEventRecord(PE).click,1);
        Assert.equal(getEventRecord(PE).click[0].getOrigin(),console.log);
        Assert.notEqual(getEventRecord(PE).click[0].getExec(),console.log);

    });
    it('defense abnormal call',function(){
        const PE =new PeAEvent(true);

        Assert.throws(function(){
            PE.on(function(){},'click');
        },TypeError);

        Assert.throws(function(){
            PE.on(function(){});
        },TypeError);

        Assert.throws(function(){
            PE.on('click');
        },TypeError);

    });
});
describe('PeAEvent#one',function(){
    it('in fact, it\'s alias to PeAEvent#one',function(){
        const PE =new PeAEvent(true);

        var spy =Sinon.spy(PE,'on');

        PE.one('click',console.log,{other:'options',once:false});

        Assert(
            spy.withArgs('click',console.log,{other:'options',once:true}).called
        );
    });
});
describe('PeAEvent#off',function(){
    it('call with origin listener',function(){
        const PE =new PeAEvent(true);
        getEventRecord(PE).click =[
            new PeAEvent.Event(console.log),
            new PeAEvent.Event(console.warn,console.error),
        ];
        Assert.lengthOf(getEventRecord(PE).click ,2);
        PE.off('click',console.log);
        Assert.lengthOf(getEventRecord(PE).click ,1);
        Assert.equal(getEventRecord(PE).click[0].getOrigin() ,console.warn);
        Assert.equal(getEventRecord(PE).click[0].getExec()   ,console.error);
        PE.off('click',console.error);
        Assert.lengthOf(getEventRecord(PE).click ,1);
        PE.off('click',console.warn);
        Assert.lengthOf(getEventRecord(PE).click ,0);
    });
    it('call with *',function(){
        const PE =new PeAEvent(true);
        getEventRecord(PE).click =[
            new PeAEvent.Event(console.log),
            new PeAEvent.Event(console.warn,console.error),
        ];
        Assert.lengthOf(getEventRecord(PE).click ,2);
        PE.off('click','*');
        Assert.notExists(getEventRecord(PE).click);
    });
    it('return true means some listener be removed',function(){
        const PE =new PeAEvent(true);
        getEventRecord(PE).click =[
            new PeAEvent.Event(console.log),
            new PeAEvent.Event(console.warn,console.error),
        ];
        Assert.lengthOf(getEventRecord(PE).click ,2);
        Assert.isTrue(PE.off('click',console.log));
        Assert.isTrue(PE.off('click','*'));
        Assert.isFalse(PE.off('click',console.log));
        Assert.isFalse(PE.off('click','*'));
        getEventRecord(PE).click =[
            new PeAEvent.Event(console.log),
        ];
        Assert.isTrue(PE.off('click',console.log));
        Assert.isFalse(PE.off('click',console.log));
        Assert.isFalse(PE.off('click','*'));
    });
});
describe('PeAEvent#wait',function(){
    it('wait a event',async function(){
        const PE =new PeAEvent(true);

        var flow =[1];

        setTimeout(function(){
            flow.push(2);
            Assert.lengthOf(getEventRecord(PE).click,1);
            getEventRecord(PE).click[0].getExec()();
            flow.push(3);
        });

        await PE.wait('click');
        flow.push(4);

        Assert.deepEqual(flow,[1,2,3,4]);

    });
    it('wait a event with checker',async function(){
        const PE =new PeAEvent(true);

        var flow =[1];

        setTimeout(function(){
            flow.push(2);
            Assert.lengthOf(getEventRecord(PE).click,1);
            getEventRecord(PE).click[0].getExec()();
            flow.push(3);
        });
        setTimeout(function(){
            flow.push(4);
            Assert.lengthOf(getEventRecord(PE).click,1);
            getEventRecord(PE).click[0].getExec()(4);
            flow.push(5);
        });

        await PE.wait('click',id=>id===4);
        flow.push(6);

        Assert.deepEqual(flow,[1,2,3,4,5,6]);

    });
    it('wait a *, depend on PeAEvent#execEventAll',async function(){
        const PE =new PeAEvent(true);

        var flow =[1];

        setTimeout(function(){
            flow.push(2);
            PE.execEventAll('click');
            flow.push(3);
        });

        await PE.wait('*');
        flow.push(4);

        Assert.deepEqual(flow,[1,2,3,4]);

    });
    it('wait a * with checker, depend on PeAEvent#execEventAll',async function(){
        const PE =new PeAEvent(true);

        var flow =[1];

        setTimeout(function(){
            flow.push(2);
            PE.execEventAll('click',[2]);
            flow.push(3);
        });
        setTimeout(function(){
            flow.push(4);
            PE.execEventAll('click',[4]);
            flow.push(5);
        });

        await PE.wait('*',id=>id===4);
        flow.push(6);

        Assert.deepEqual(flow,[1,2,3,4,5,6]);

    });

});
describe('PeAEvent#execEventAll',function(){
    it('second argument must be an Array',function(){
        const PE =new PeAEvent(true);
        Assert.throws(function(){
            PE.execEventAll('click','abc');
        },TypeError);
        Assert.throws(function(){
            PE.execEventAll('click',{length:0});
        },TypeError);
        Assert.doesNotThrow(function(){
            PE.execEventAll('click',[]);
        },TypeError);
    });
    it('will call PeAEvent#execListener with PeAEvent.Event#getExec',function(){
        const PE =new PeAEvent(true);

        var listener =Sinon.spy();
        var pee =new PeAEvent.Event(console.log,listener);
        getEventRecord(PE).click =[pee];

        Sinon.spy(PE ,'execListener');

        var args =[Symbol()];
        PE.execEventAll('click',args);

        Assert(PE.execListener.withArgs(pee.getExec() ,args ,'click').calledOnce);
        Assert(pee.getExec().withArgs(...args).calledOnce);

    });
    it('aways return a Promise',async function(){
        const PE =new PeAEvent(true);

        Assert.instanceOf(PE.execEventAll('click'),Promise);
        Assert.instanceOf(PE.execEventAll('*')    ,Promise);
        getEventRecord(PE).click=[];
        Assert.instanceOf(PE.execEventAll('click'),Promise);
        Assert.instanceOf(PE.execEventAll('*')    ,Promise);
        getEventRecord(PE).click=[
            new PeAEvent.Event(()=>{})
        ];
        Assert.instanceOf(PE.execEventAll('click'),Promise);
        Assert.instanceOf(PE.execEventAll('*')    ,Promise);

    });
    it('receive listener return value',async function(){
        const PE =new PeAEvent(true);

        var flow =[1];

        getEventRecord(PE).click=[
            new PeAEvent.Event(function(val){
                flow.push(val);
                flow.push(2);
                return 3;
            })
        ];

        flow.push(4);

        flow.push(
            await PE.execEventAll('click',[5])
        );

        flow.push(6);

        Assert.deepEqual(flow,[1,4,5,2,3,6]);

    });
    it('receive listener return fastest resolved promises value',async function(){
        const PE =new PeAEvent(true);

        var flow =[1];

        getEventRecord(PE).click=[
            new PeAEvent.Event(function(val){
                flow.push(val);
                flow.push(2);
                return new Promise(resolve=>setTimeout(resolve.bind(null,3),20));
            }),
            new PeAEvent.Event(function(val){
                flow.push(val);
                flow.push(4);
                return new Promise(resolve=>setTimeout(resolve.bind(null,5),10));
            }),
        ];

        flow.push(6);

        flow.push(
            await PE.execEventAll('click',[7])
        );

        flow.push(8);

        Assert.deepEqual(flow,[1,6,7,2,7,4,5,8]);

    });
});
describe('PeAEvent other',function(){
    it('PeAEvent#reset',function(){
        const PE =new PeAEvent(true);
        getEventRecord(PE).click =[
            new PeAEvent.Event(console.log),
            new PeAEvent.Event(console.warn),
        ];
        getEventRecord(PE).dbclick =[
            new PeAEvent.Event(console.error),
        ];
        Assert.notDeepEqual(getEventRecord(PE),{});
        PE.reset();
        Assert.deepEqual(getEventRecord(PE),{});
    });
    it('PeAEvent#has',function(){
        const PE =new PeAEvent(true);
        Assert.strictEqual(PE.has('click'),0);
        getEventRecord(PE).dbclick =[];
        Assert.strictEqual(PE.has('click'),0);
        getEventRecord(PE).click =[
            new PeAEvent.Event(console.log),
            new PeAEvent.Event(console.warn),
        ];
        Assert.strictEqual(PE.has('click'),2);
        getEventRecord(PE).click.push(
            new PeAEvent.Event(console.error)
        );
        Assert.strictEqual(PE.has('click'),3);
    });
});
describe('comprehensive test',function(){
    it('on/one/off/execEventAll',async function(){
        const PE =new PeAEvent(true);
        var listener1 =null;
        var listener2 =null;

        listener1 =Sinon.spy();
        listener2 =Sinon.spy();

        PE.on('click' ,listener1);
        PE.one('*'    ,listener2);

        var args1 =[Symbol()];
        await PE.execEventAll('click',args1);

        Assert(listener1.withArgs(...args1).called);
        Assert(listener2.withArgs(...args1).called);

        await PE.execEventAll('click',args1);
        Assert.strictEqual(listener1.callCount ,2);
        Assert.strictEqual(listener2.callCount ,1);

        PE.off('click',listener1);
        await PE.execEventAll('click',args1);
        Assert.strictEqual(listener1.callCount ,2);
        Assert.strictEqual(listener2.callCount ,1);

        var sym =Symbol();
        listener1 =Sinon.spy(function(){
            return Promise.resolve(sym);
        });
        listener2 =Sinon.spy(function(){});
        PE.one('click',listener1);
        PE.on ('click',listener2);
        Assert.strictEqual((await PE.execEventAll('click',args1)),sym);

    });
    it('wait/off*/execEventAll',async function(){
        const PE =new PeAEvent(true);

        setTimeout(function(){
            PE.off('click','*');
            PE.execEventAll('click');
        });

        PE.wait('click').then(function(){
            Assert(false ,'off(eventType ,*) should remove waiter');
        });
    });
});
