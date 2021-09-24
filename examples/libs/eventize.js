/*!
=============================================================================
eventize-js 2.0.0-beta.2+es2017.20210924
— https://github.com/spearwolf/eventize.git
=============================================================================

Copyright 2015-2021 Wolfger Schramm

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const e={Max:Number.POSITIVE_INFINITY,AAA:1e9,BB:1e6,C:1e3,Default:0,Low:-1e4,Min:Number.NEGATIVE_INFINITY},t=(Symbol.eventize||(Symbol.eventize=Symbol("eventize")),Symbol.eventize),s=e=>"*"===e,r=e=>{switch(typeof e){case"string":case"symbol":return!0;default:return!1}},i="undefined"!=typeof console,n=i?console[console.warn?"warn":"log"].bind(console,"[eventize]"):()=>{};class a{constructor(){this.events=new Map,this.eventNames=new Set}add(e){Array.isArray(e)?e.forEach((e=>this.eventNames.add(e))):this.eventNames.add(e)}remove(e){Array.isArray(e)?e.forEach((e=>this.eventNames.delete(e))):this.eventNames.delete(e)}retain(e,t){this.eventNames.has(e)&&this.events.set(e,t)}isKnown(e){return this.eventNames.has(e)}emit(e,t){if(s(e))this.eventNames.forEach((e=>this.emit(e,t)));else{const s=this.events.get(e);s&&t.apply(e,s)}}}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */const l=(e,t,s)=>{"function"==typeof t&&t.apply(e,s)};let o=0;class c{constructor(e,t,r,i=null){this.id=++o,this.eventName=e,this.isCatchEmAll=s(e),this.listener=r,this.listenerObject=i,this.priority=t,this.listenerType=(e=>{switch(typeof e){case"function":return 1;case"string":case"symbol":return 2;case"object":return 4}})(r),this.callAfterApply=void 0,this.isRemoved=!1,this.refCount=1}isEqual(e,t=null){if(e===this)return!0;const s=typeof e;return"number"===s&&e===this.id||(null!==t||"string"!==s&&"symbol"!==s?this.listener===e&&this.listenerObject===t:"*"===e||e===this.eventName)}apply(e,t){if(this.isRemoved)return;const{listener:s,listenerObject:r}=this;switch(this.listenerType){case 1:l(r,s,t),this.callAfterApply&&this.callAfterApply();break;case 2:l(r,r[s],t),this.callAfterApply&&this.callAfterApply();break;case 4:{const r=s[e];(this.isCatchEmAll||this.eventName===e)&&("function"==typeof r?r.apply(s,t):((e,t,s)=>{l(t,t.emit,[e].concat(s))})(e,s,t),this.callAfterApply&&this.callAfterApply());break}}}}var h;const f=(e,t)=>e.priority!==t.priority?t.priority-e.priority:e.id-t.id,m=e=>null==e?void 0:e.slice(0),u=(e,t)=>{const s=e.indexOf(t);s>-1&&e.splice(s,1)},y=(e,t,s)=>{const r=e.findIndex((e=>e.isEqual(t,s)));r>-1&&(e[r].isRemoved=!0,e.splice(r,1))},p=(e,t,s)=>{const r=[];for(const i of e)(null==t&&i.listenerObject===s||i.eventName===t&&i.listener===s)&&r.push(i);for(const i of r)y(e,i,void 0)},d=e=>{e&&(e.forEach((e=>{e.isRemoved=!0})),e.length=0)};class A{constructor(){h.set(this,(e=>{let t=this.namedListeners.get(e);return t||(t=[],this.namedListeners.set(e,t)),t})),this.namedListeners=new Map,this.catchEmAllListeners=[]}add(e){return((e,t)=>{const s=((e,t)=>{if(4===(s=e.listenerType)||2===s)return t.find((t=>{return r=t,(s=e).listenerType===r.listenerType&&s.priority===r.priority&&s.eventName===r.eventName&&s.listenerObject===r.listenerObject&&s.listener===r.listener;var s,r}));var s})(e,t);return s?(s.refCount+=1,s):(t.push(e),t.sort(f),e)})(e,e.isCatchEmAll?this.catchEmAllListeners:function(e,t,s,r){if("a"===s&&!r)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!r:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===s?r:"a"===s?r.call(e):r?r.value:t.get(e)}(this,h,"f").call(this,e.eventName))}remove(e,t,i=!1){null==t&&Array.isArray(e)?e.forEach((e=>this.remove(e,null,i))):null==e||null==t&&s(e)?this.removeAllListeners():null==t&&r(e)?d(this.namedListeners.get(e)):e instanceof c?e.isRemoved||(e.refCount-=1,e.refCount<1&&(e.isRemoved=!0,this.namedListeners.forEach((t=>u(t,e))),u(this.catchEmAllListeners,e))):i?s(e)?p(this.catchEmAllListeners,"*",e):this.namedListeners.forEach((s=>p(s,e,t))):(this.namedListeners.forEach((s=>{y(s,e,t),p(s,void 0,e)})),y(this.catchEmAllListeners,e,t),p(this.catchEmAllListeners,void 0,e))}removeAllListeners(){this.namedListeners.forEach((e=>d(e))),this.namedListeners.clear(),d(this.catchEmAllListeners)}forEach(e,t){const s=m(this.catchEmAllListeners),r=m(this.namedListeners.get(e));if("*"!==e&&r&&0!==r.length)if(0===s.length)r.forEach(t);else{const e=r.length,i=s.length;let n=0,a=0;for(;n<e||a<i;){if(n<e){const e=r[n];if(a>=i||e.priority>=s[a].priority){t(e),++n;continue}}a<i&&(t(s[a]),++a)}}else s.forEach(t)}}h=new WeakMap;const v=e=>Boolean(e&&e[t]),b=(t,s,r)=>{const a=r.length,l=typeof r[0];let o,h,f,m;if(a>=2&&a<=3&&"number"===l?(o="*",[h,f,m]=r):a>=3&&a<=4&&"number"==typeof r[1]?[o,h,f,m]=r:(h=e.Default,"string"===l||"symbol"===l||Array.isArray(r[0])?[o,f,m]=r:(o="*",[f,m]=r)),!f&&i)throw n("called with insufficient arguments!",r),"subscribeTo called with insufficient arguments!";const u=e=>r=>((e,t,s,r,i,n)=>{const a=e.add(new c(s,r,i,n));return t.emit(s,a),a})(t,s,r,e,f,m);return Array.isArray(o)?o.map((e=>Array.isArray(e)?u(e[1])(e[0]):u(h)(e))):u(h)(o)},E=e=>t=>{t.callAfterApply=()=>e.off(t)},g=(e,t)=>Object.assign((()=>e.off(t)),Array.isArray(t)?{listeners:t}:{listener:t});function w(e){if(v(e))return e;const s=new A,i=new a;((e,t,s)=>{Object.defineProperty(e,t,{value:s,configurable:!0})})(e,t,{keeper:i,store:s});const n=Object.assign(e,{on:(...e)=>g(n,b(s,i,e)),once(...e){const t=b(s,i,e);return Array.isArray(t)?t.forEach(E(n)):E(n)(t),g(n,t)},off(e,t){const n=typeof e,a=null!=t&&("string"===n||"symbol"===n);s.remove(e,t,a),Array.isArray(e)?i.remove(e.filter((e=>"string"==typeof e))):r(e)&&i.remove(e)},emit(e,...t){Array.isArray(e)?e.forEach((e=>{s.forEach(e,(s=>s.apply(e,t))),i.retain(e,t)})):"*"!==e&&(s.forEach(e,(s=>{s.apply(e,t)})),i.retain(e,t))},retain(e){i.add(e)}});return n}const N=(()=>{const t=e=>w(e);return t.inject=w,t.extend=e=>w(Object.create(e)),t.create=t=>{const s=w({});return s.on("*",e.Default,t),s},t.is=v,t.Priority=e,t})();class L{constructor(){N(this)}}export{L as Eventize,e as Priority,N as default,w as injectEventizeApi,v as isEventized};
//# sourceMappingURL=eventize.js.map
