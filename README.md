# pea-event &middot; [![travis-ci Status](https://travis-ci.org/pea3nut/pea-event.svg?branch=master)](https://www.travis-ci.org/pea3nut/pea-event) [![soverage Status](https://coveralls.io/repos/github/pea3nut/pea-event/badge.svg?branch=master)](https://coveralls.io/github/pea3nut/pea-event?branch=master) [![npm version](https://img.shields.io/npm/v/pea-event.svg?style=flat)](https://www.npmjs.com/package/pea-event) [![MIT](https://img.shields.io/dub/l/vibe-d.svg)](LICENSE)

A can be extended event model class, usual use it in javascript application.

# What is this?

pea-event is a javascript class, It can help you manage events reliably in you application.

```js
class App extends PeAEvent{};

var app =new App();
app.on('click',function(date){
  console.log('app be clicked',date);
});

app.execEventAll('click',[new Date]);
```

Is nothing to be surprised at? 

How about this:

```js
class App extends PeAEvent{};

var app =new App();
setTimeout(function(){
  app.execEventAll('load');
},1000);

(async function(){
  await app.wait('load');
  console.log('app loaded');
}());
```

It's vary semantic right?

pea-event can do more than this, maybe you should look at the [APIs](#APIs)

# APIs

<!--jsdoc will generate here-->

<!--jsdoc-->

<a name="PeAEvent"></a>

## PeAEvent
**Kind**: global class  

* [PeAEvent](#PeAEvent)
    * [new PeAEvent([asTools])](#new_PeAEvent_new)
    * [.on(eventType, listener, [options])](#PeAEvent+on)
    * [.one(eventType, listener, [options])](#PeAEvent+one)
    * [.off(eventType, listener)](#PeAEvent+off) ⇒ <code>boolean</code>
    * [.wait(eventType, [checker])](#PeAEvent+wait) ⇒ <code>Promise</code>
    * [.has(eventType)](#PeAEvent+has) ⇒ <code>Number</code>
    * [.reset()](#PeAEvent+reset)
    * *[.execEventAll(type, args)](#PeAEvent+execEventAll) ⇒ <code>Promise</code>*
    * *[.execListener(listener, args, eventType)](#PeAEvent+execListener)*

<a name="new_PeAEvent_new"></a>

### new PeAEvent([asTools])
recommend extend this class, direct construct will throw an error


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [asTools] | <code>boolean</code> | <code>false</code> | if you really want just construct it, call with true |

<a name="PeAEvent+on"></a>

### PeAEvent.on(eventType, listener, [options])
listen a event, add a listener for event

**Kind**: instance method of [<code>PeAEvent</code>](#PeAEvent)  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>string</code> | "*" means all |
| listener | <code>function</code> |  |
| [options] | <code>Object</code> |  |
| options.once | <code>boolean</code> | If true, the listener would be automatically removed when invoked. |

<a name="PeAEvent+one"></a>

### PeAEvent.one(eventType, listener, [options])
listen a event but onceit's alias for PeAEvent#on(eventType,listener,{once:true})

**Kind**: instance method of [<code>PeAEvent</code>](#PeAEvent)  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>string</code> | "*" means all |
| listener | <code>function</code> |  |
| [options] | <code>Object</code> |  |

<a name="PeAEvent+off"></a>

### PeAEvent.off(eventType, listener) ⇒ <code>boolean</code>
remove a event listener> note: if you use * in listener, waiter will be remove too

**Kind**: instance method of [<code>PeAEvent</code>](#PeAEvent)  
**Returns**: <code>boolean</code> - success or no  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>string</code> |  |
| listener | <code>function</code> \| <code>string</code> | "*" means all |

<a name="PeAEvent+wait"></a>

### PeAEvent.wait(eventType, [checker]) ⇒ <code>Promise</code>
wait a eventyou can add a checker, return a boolean to specify whether to waitif return a true, promise will be resolve

**Kind**: instance method of [<code>PeAEvent</code>](#PeAEvent)  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>string</code> | "*" means all |
| [checker] | <code>function</code> | a checker function, it will call by event dispatch and received dispatch's argument, return a boolean for resolve or keep waiting |

<a name="PeAEvent+has"></a>

### PeAEvent.has(eventType) ⇒ <code>Number</code>
return the number of listeners for a given event type

**Kind**: instance method of [<code>PeAEvent</code>](#PeAEvent)  

| Param | Type |
| --- | --- |
| eventType | <code>string</code> | 

<a name="PeAEvent+reset"></a>

### PeAEvent.reset()
reset all event listener

**Kind**: instance method of [<code>PeAEvent</code>](#PeAEvent)  
<a name="PeAEvent+execEventAll"></a>

### *PeAEvent.execEventAll(type, args) ⇒ <code>Promise</code>*
trigger a event, exec this event's listener allyou can overwrite this method to changed you want,but overwrite method should use PeAEvent#execListener(listener ,arguments ,eventType) to exec a listener

**Kind**: instance abstract method of [<code>PeAEvent</code>](#PeAEvent)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | event name to trigger |
| args | <code>Array</code> | passed argument |

<a name="PeAEvent+execListener"></a>

### *PeAEvent.execListener(listener, args, eventType)*
how call a event listeneryou can overwrite this method to changed you want

**Kind**: instance abstract method of [<code>PeAEvent</code>](#PeAEvent)  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>function</code> | event listener |
| args | <code>Array</code> | the parameters passed in when the event is trigger |
| eventType | <code>string</code> | the event name |



<!--/jsdoc-->
