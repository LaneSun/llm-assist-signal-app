var hn=Array.isArray,dn=Array.prototype.indexOf,ne=Array.from,ee=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,wn=Object.getOwnPropertyDescriptors,yn=Object.prototype,En=Array.prototype,qt=Object.getPrototypeOf,kt=Object.isExtensible;function re(t){return typeof t=="function"}const ae=()=>{};function le(t){return t()}function jt(t){for(var e=0;e<t.length;e++)t[e]()}const x=2,Yt=4,ot=8,xt=16,S=32,V=64,rt=128,m=256,at=512,y=1024,O=2048,C=4096,B=8192,_t=16384,gn=32768,Ht=65536,mn=1<<17,Tn=1<<19,Bt=1<<20,yt=1<<21,M=Symbol("$state"),se=Symbol("legacy props"),fe=Symbol("");function Ut(t){return t===this.v}function xn(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function Vt(t){return!xn(t,this.v)}function An(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function bn(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function Rn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function In(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function ue(){throw new Error("https://svelte.dev/e/hydration_failed")}function ie(t){throw new Error("https://svelte.dev/e/lifecycle_legacy_only")}function oe(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Dn(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function On(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Sn(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let ct=!1;function _e(){ct=!0}const ce=1,ve=2,pe=4,he=8,de=16,we=1,ye=2,Ee=4,ge=8,me=16,Te=1,xe=2,kn="[",Nn="[!",Cn="]",Gt={},E=Symbol(),Ae="http://www.w3.org/1999/xhtml",be="http://www.w3.org/2000/svg";function Pn(t){throw new Error("https://svelte.dev/e/lifecycle_outside_component")}let p=null;function Nt(t){p=t}function Re(t){return At().get(t)}function Ie(t,e){return At().set(t,e),e}function De(t){return At().has(t)}function Oe(t,e=!1,n){var r=p={p,c:null,d:!1,e:null,m:!1,s:t,x:null,l:null};ct&&!e&&(p.l={s:null,u:null,r1:[],r2:Rt(!1)}),jn(()=>{r.d=!0})}function Se(t){const e=p;if(e!==null){t!==void 0&&(e.x=t);const i=e.e;if(i!==null){var n=h,r=v;e.e=null;try{for(var a=0;a<i.length;a++){var l=i[a];ft(l.effect),U(l.reaction),tn(l.fn)}}finally{ft(n),U(r)}}p=e.p,e.m=!0}return t||{}}function vt(){return!ct||p!==null&&p.l===null}function At(t){return p===null&&Pn(),p.c??(p.c=new Map(Fn(p)||void 0))}function Fn(t){let e=t.p;for(;e!==null;){const n=e.c;if(n!==null)return n;e=e.p}return null}function H(t){if(typeof t!="object"||t===null||M in t)return t;const e=qt(t);if(e!==yn&&e!==En)return t;var n=new Map,r=hn(t),a=k(0),l=v,i=u=>{var s=v;U(l);var f=u();return U(s),f};return r&&n.set("length",k(t.length)),new Proxy(t,{defineProperty(u,s,f){(!("value"in f)||f.configurable===!1||f.enumerable===!1||f.writable===!1)&&Dn();var _=n.get(s);return _===void 0?(_=i(()=>k(f.value)),n.set(s,_)):D(_,i(()=>H(f.value))),!0},deleteProperty(u,s){var f=n.get(s);if(f===void 0)s in u&&n.set(s,i(()=>k(E)));else{if(r&&typeof s=="string"){var _=n.get("length"),o=Number(s);Number.isInteger(o)&&o<_.v&&D(_,o)}D(f,E),Ct(a)}return!0},get(u,s,f){var b;if(s===M)return t;var _=n.get(s),o=s in u;if(_===void 0&&(!o||(b=Z(u,s))!=null&&b.writable)&&(_=i(()=>k(H(o?u[s]:E))),n.set(s,_)),_!==void 0){var c=F(_);return c===E?void 0:c}return Reflect.get(u,s,f)},getOwnPropertyDescriptor(u,s){var f=Reflect.getOwnPropertyDescriptor(u,s);if(f&&"value"in f){var _=n.get(s);_&&(f.value=F(_))}else if(f===void 0){var o=n.get(s),c=o==null?void 0:o.v;if(o!==void 0&&c!==E)return{enumerable:!0,configurable:!0,value:c,writable:!0}}return f},has(u,s){var c;if(s===M)return!0;var f=n.get(s),_=f!==void 0&&f.v!==E||Reflect.has(u,s);if(f!==void 0||h!==null&&(!_||(c=Z(u,s))!=null&&c.writable)){f===void 0&&(f=i(()=>k(_?H(u[s]):E)),n.set(s,f));var o=F(f);if(o===E)return!1}return _},set(u,s,f,_){var St;var o=n.get(s),c=s in u;if(r&&s==="length")for(var b=f;b<o.v;b+=1){var tt=n.get(b+"");tt!==void 0?D(tt,E):b in u&&(tt=i(()=>k(E)),n.set(b+"",tt))}o===void 0?(!c||(St=Z(u,s))!=null&&St.writable)&&(o=i(()=>k(void 0)),D(o,i(()=>H(f))),n.set(s,o)):(c=o.v!==E,D(o,i(()=>H(f))));var nt=Reflect.getOwnPropertyDescriptor(u,s);if(nt!=null&&nt.set&&nt.set.call(_,f),!c){if(r&&typeof s=="string"){var Ot=n.get("length"),wt=Number(s);Number.isInteger(wt)&&wt>=Ot.v&&D(Ot,wt+1)}Ct(a)}return!0},ownKeys(u){F(a);var s=Reflect.ownKeys(u).filter(o=>{var c=n.get(o);return c===void 0||c.v!==E});for(var[f,_]of n)_.v!==E&&!(f in u)&&s.push(f);return s},setPrototypeOf(){On()}})}function Ct(t,e=1){D(t,t.v+e)}function Pt(t){try{if(t!==null&&typeof t=="object"&&M in t)return t[M]}catch{}return t}function ke(t,e){return Object.is(Pt(t),Pt(e))}function bt(t){var e=x|O,n=v!==null&&(v.f&x)!==0?v:null;return h===null||n!==null&&(n.f&m)!==0?e|=m:h.f|=Bt,{ctx:p,deps:null,effects:null,equals:Ut,f:e,fn:t,reactions:null,rv:0,v:null,wv:0,parent:n??h}}function Ne(t){const e=bt(t);return un(e),e}function Ce(t){const e=bt(t);return e.equals=Vt,e}function Kt(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)j(e[n])}}function Mn(t){for(var e=t.parent;e!==null;){if((e.f&x)===0)return e;e=e.parent}return null}function Zt(t){var e,n=h;ft(Mn(t));try{Kt(t),e=vn(t)}finally{ft(n)}return e}function $t(t){var e=Zt(t),n=(N||(t.f&m)!==0)&&t.deps!==null?C:y;A(t,n),t.equals(e)||(t.v=e,t.wv=_n())}const z=new Map;function Rt(t,e){var n={f:0,v:t,reactions:null,equals:Ut,rv:0,wv:0};return n}function k(t,e){const n=Rt(t);return un(n),n}function Pe(t,e=!1){var r;const n=Rt(t);return e||(n.equals=Vt),ct&&p!==null&&p.l!==null&&((r=p.l).s??(r.s=[])).push(n),n}function D(t,e,n=!1){v!==null&&!R&&vt()&&(v.f&(x|xt))!==0&&!(w!=null&&w.includes(t))&&Sn();let r=n?H(e):e;return Et(t,r)}function Et(t,e){if(!t.equals(e)){var n=t.v;X?z.set(t,e):z.set(t,n),t.v=e,(t.f&x)!==0&&((t.f&O)!==0&&Zt(t),A(t,(t.f&m)===0?y:C)),t.wv=_n(),zt(t,O),vt()&&h!==null&&(h.f&y)!==0&&(h.f&(S|V))===0&&(T===null?Gn([t]):T.push(t))}return e}function Fe(t,e=1){var n=F(t),r=e===1?n++:n--;return D(t,n),r}function zt(t,e){var n=t.reactions;if(n!==null)for(var r=vt(),a=n.length,l=0;l<a;l++){var i=n[l],u=i.f;(u&O)===0&&(!r&&i===h||(A(i,e),(u&(y|m))!==0&&((u&x)!==0?zt(i,C):dt(i))))}}function Jt(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let q=!1;function Me(t){q=t}let I;function J(t){if(t===null)throw Jt(),Gt;return I=t}function Le(){return J(Y(I))}function qe(t){if(q){if(Y(I)!==null)throw Jt(),Gt;I=t}}function je(t=1){if(q){for(var e=t,n=I;e--;)n=Y(n);I=n}}function Ye(){for(var t=0,e=I;;){if(e.nodeType===8){var n=e.data;if(n===Cn){if(t===0)return e;t-=1}else(n===kn||n===Nn)&&(t+=1)}var r=Y(e);e.remove(),e=r}}var Ft,Ln,Qt,Wt;function He(){if(Ft===void 0){Ft=window,Ln=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;Qt=Z(e,"firstChild").get,Wt=Z(e,"nextSibling").get,kt(t)&&(t.__click=void 0,t.__className=void 0,t.__attributes=null,t.__style=void 0,t.__e=void 0),kt(n)&&(n.__t=void 0)}}function gt(t=""){return document.createTextNode(t)}function mt(t){return Qt.call(t)}function Y(t){return Wt.call(t)}function Be(t,e){if(!q)return mt(t);var n=mt(I);if(n===null)n=I.appendChild(gt());else if(e&&n.nodeType!==3){var r=gt();return n==null||n.before(r),J(r),r}return J(n),n}function Ue(t,e){if(!q){var n=mt(t);return n instanceof Comment&&n.data===""?Y(n):n}return I}function Ve(t,e=1,n=!1){let r=q?I:t;for(var a;e--;)a=r,r=Y(r);if(!q)return r;var l=r==null?void 0:r.nodeType;if(n&&l!==3){var i=gt();return r===null?a==null||a.after(i):r.before(i),J(i),i}return J(r),r}function Ge(t){t.textContent=""}function Xt(t){h===null&&v===null&&Rn(),v!==null&&(v.f&m)!==0&&h===null&&bn(),X&&An()}function qn(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function G(t,e,n,r=!0){var a=h,l={ctx:p,deps:null,nodes_start:null,nodes_end:null,f:t|O,first:null,fn:e,last:null,next:null,parent:a,prev:null,teardown:null,transitions:null,wv:0};if(n)try{ht(l),l.f|=gn}catch(s){throw j(l),s}else e!==null&&dt(l);var i=n&&l.deps===null&&l.first===null&&l.nodes_start===null&&l.teardown===null&&(l.f&(Bt|rt))===0;if(!i&&r&&(a!==null&&qn(l,a),v!==null&&(v.f&x)!==0)){var u=v;(u.effects??(u.effects=[])).push(l)}return l}function Ke(){return v!==null&&!R}function jn(t){const e=G(ot,null,!1);return A(e,y),e.teardown=t,e}function Ze(t){Xt();var e=h!==null&&(h.f&S)!==0&&p!==null&&!p.m;if(e){var n=p;(n.e??(n.e=[])).push({fn:t,effect:h,reaction:v})}else{var r=tn(t);return r}}function $e(t){return Xt(),It(t)}function ze(t){const e=G(V,t,!0);return(n={})=>new Promise(r=>{n.outro?Bn(e,()=>{j(e),r(void 0)}):(j(e),r(void 0))})}function tn(t){return G(Yt,t,!1)}function Je(t,e){var n=p,r={effect:null,ran:!1};n.l.r1.push(r),r.effect=It(()=>{t(),!r.ran&&(r.ran=!0,D(n.l.r2,!0),Dt(e))})}function Qe(){var t=p;It(()=>{if(F(t.l.r2)){for(var e of t.l.r1){var n=e.effect;(n.f&y)!==0&&A(n,C),K(n)&&ht(n),e.ran=!1}t.l.r2.v=!1}})}function It(t){return G(ot,t,!0)}function We(t,e=[],n=bt){const r=e.map(n);return Yn(()=>t(...r.map(F)))}function Yn(t,e=0){return G(ot|xt|e,t,!0)}function Xe(t,e=!0){return G(ot|S,t,!0,e)}function nn(t){var e=t.teardown;if(e!==null){const n=X,r=v;Lt(!0),U(null);try{e.call(null)}finally{Lt(n),U(r)}}}function en(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){var r=n.next;(n.f&V)!==0?n.parent=null:j(n,e),n=r}}function Hn(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&S)===0&&j(e),e=n}}function j(t,e=!0){var n=!1;if((e||(t.f&Tn)!==0)&&t.nodes_start!==null){for(var r=t.nodes_start,a=t.nodes_end;r!==null;){var l=r===a?null:Y(r);r.remove(),r=l}n=!0}en(t,e&&!n),it(t,0),A(t,_t);var i=t.transitions;if(i!==null)for(const s of i)s.stop();nn(t);var u=t.parent;u!==null&&u.first!==null&&rn(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function rn(t){var e=t.parent,n=t.prev,r=t.next;n!==null&&(n.next=r),r!==null&&(r.prev=n),e!==null&&(e.first===t&&(e.first=r),e.last===t&&(e.last=n))}function Bn(t,e){var n=[];an(t,n,!0),Un(n,()=>{j(t),e&&e()})}function Un(t,e){var n=t.length;if(n>0){var r=()=>--n||e();for(var a of t)a.out(r)}else e()}function an(t,e,n){if((t.f&B)===0){if(t.f^=B,t.transitions!==null)for(const i of t.transitions)(i.is_global||n)&&e.push(i);for(var r=t.first;r!==null;){var a=r.next,l=(r.f&Ht)!==0||(r.f&S)!==0;an(r,e,l?n:!1),r=a}}}function tr(t){ln(t,!0)}function ln(t,e){if((t.f&B)!==0){t.f^=B,(t.f&y)===0&&(t.f^=y),K(t)&&(A(t,O),dt(t));for(var n=t.first;n!==null;){var r=n.next,a=(n.f&Ht)!==0||(n.f&S)!==0;ln(n,a?e:!1),n=r}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||e)&&l.in()}}const Vn=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let Q=[],W=[];function sn(){var t=Q;Q=[],jt(t)}function fn(){var t=W;W=[],jt(t)}function nr(t){Q.length===0&&queueMicrotask(sn),Q.push(t)}function er(t){W.length===0&&Vn(fn),W.push(t)}function Mt(){Q.length>0&&sn(),W.length>0&&fn()}let et=!1,lt=!1,st=null,L=!1,X=!1;function Lt(t){X=t}let $=[];let v=null,R=!1;function U(t){v=t}let h=null;function ft(t){h=t}let w=null;function un(t){v!==null&&v.f&yt&&(w===null?w=[t]:w.push(t))}let d=null,g=0,T=null;function Gn(t){T=t}let on=1,ut=0,N=!1,P=null;function _n(){return++on}function K(t){var o;var e=t.f;if((e&O)!==0)return!0;if((e&C)!==0){var n=t.deps,r=(e&m)!==0;if(n!==null){var a,l,i=(e&at)!==0,u=r&&h!==null&&!N,s=n.length;if(i||u){var f=t,_=f.parent;for(a=0;a<s;a++)l=n[a],(i||!((o=l==null?void 0:l.reactions)!=null&&o.includes(f)))&&(l.reactions??(l.reactions=[])).push(f);i&&(f.f^=at),u&&_!==null&&(_.f&m)===0&&(f.f^=m)}for(a=0;a<s;a++)if(l=n[a],K(l)&&$t(l),l.wv>t.wv)return!0}(!r||h!==null&&!N)&&A(t,y)}return!1}function Kn(t,e){for(var n=e;n!==null;){if((n.f&rt)!==0)try{n.fn(t);return}catch{n.f^=rt}n=n.parent}throw et=!1,t}function Zn(t){return(t.f&_t)===0&&(t.parent===null||(t.parent.f&rt)===0)}function pt(t,e,n,r){if(et){if(n===null&&(et=!1),Zn(e))throw t;return}n!==null&&(et=!0);{Kn(t,e);return}}function cn(t,e,n=!0){var r=t.reactions;if(r!==null)for(var a=0;a<r.length;a++){var l=r[a];w!=null&&w.includes(t)||((l.f&x)!==0?cn(l,e,!1):e===l&&(n?A(l,O):(l.f&y)!==0&&A(l,C),dt(l)))}}function vn(t){var b;var e=d,n=g,r=T,a=v,l=N,i=w,u=p,s=R,f=t.f;d=null,g=0,T=null,N=(f&m)!==0&&(R||!L||v===null),v=(f&(S|V))===0?t:null,w=null,Nt(t.ctx),R=!1,ut++,t.f|=yt;try{var _=(0,t.fn)(),o=t.deps;if(d!==null){var c;if(it(t,g),o!==null&&g>0)for(o.length=g+d.length,c=0;c<d.length;c++)o[g+c]=d[c];else t.deps=o=d;if(!N)for(c=g;c<o.length;c++)((b=o[c]).reactions??(b.reactions=[])).push(t)}else o!==null&&g<o.length&&(it(t,g),o.length=g);if(vt()&&T!==null&&!R&&o!==null&&(t.f&(x|C|O))===0)for(c=0;c<T.length;c++)cn(T[c],t);return a!==t&&(ut++,T!==null&&(r===null?r=T:r.push(...T))),_}finally{d=e,g=n,T=r,v=a,N=l,w=i,Nt(u),R=s,t.f^=yt}}function $n(t,e){let n=e.reactions;if(n!==null){var r=dn.call(n,t);if(r!==-1){var a=n.length-1;a===0?n=e.reactions=null:(n[r]=n[a],n.pop())}}n===null&&(e.f&x)!==0&&(d===null||!d.includes(e))&&(A(e,C),(e.f&(m|at))===0&&(e.f^=at),Kt(e),it(e,0))}function it(t,e){var n=t.deps;if(n!==null)for(var r=e;r<n.length;r++)$n(t,n[r])}function ht(t){var e=t.f;if((e&_t)===0){A(t,y);var n=h,r=p,a=L;h=t,L=!0;try{(e&xt)!==0?Hn(t):en(t),nn(t);var l=vn(t);t.teardown=typeof l=="function"?l:null,t.wv=on;var i=t.deps,u}catch(s){pt(s,t,n,r||t.ctx)}finally{L=a,h=n}}}function zn(){try{In()}catch(t){if(st!==null)pt(t,st,null);else throw t}}function pn(){var t=L;try{var e=0;for(L=!0;$.length>0;){e++>1e3&&zn();var n=$,r=n.length;$=[];for(var a=0;a<r;a++){var l=Qn(n[a]);Jn(l)}z.clear()}}finally{lt=!1,L=t,st=null}}function Jn(t){var e=t.length;if(e!==0)for(var n=0;n<e;n++){var r=t[n];if((r.f&(_t|B))===0)try{K(r)&&(ht(r),r.deps===null&&r.first===null&&r.nodes_start===null&&(r.teardown===null?rn(r):r.fn=null))}catch(a){pt(a,r,null,r.ctx)}}}function dt(t){lt||(lt=!0,queueMicrotask(pn));for(var e=st=t;e.parent!==null;){e=e.parent;var n=e.f;if((n&(V|S))!==0){if((n&y)===0)return;e.f^=y}}$.push(e)}function Qn(t){for(var e=[],n=t;n!==null;){var r=n.f,a=(r&(S|V))!==0,l=a&&(r&y)!==0;if(!l&&(r&B)===0){if((r&Yt)!==0)e.push(n);else if(a)n.f^=y;else{var i=v;try{v=n,K(n)&&ht(n)}catch(f){pt(f,n,null,n.ctx)}finally{v=i}}var u=n.first;if(u!==null){n=u;continue}}var s=n.parent;for(n=n.next;n===null&&s!==null;)n=s.next,s=s.parent}return e}function Wn(t){var e;for(Mt();$.length>0;)lt=!0,pn(),Mt();return e}async function rr(){await Promise.resolve(),Wn()}function F(t){var e=t.f,n=(e&x)!==0;if(P!==null&&P.add(t),v!==null&&!R){if(!(w!=null&&w.includes(t))){var r=v.deps;t.rv<ut&&(t.rv=ut,d===null&&r!==null&&r[g]===t?g++:d===null?d=[t]:(!N||!d.includes(t))&&d.push(t))}}else if(n&&t.deps===null&&t.effects===null){var a=t,l=a.parent;l!==null&&(l.f&m)===0&&(a.f^=m)}return n&&(a=t,K(a)&&$t(a)),X&&z.has(t)?z.get(t):t.v}function Xn(t){var e=P;P=new Set;var n=P,r;try{if(Dt(t),e!==null)for(r of P)e.add(r)}finally{P=e}return n}function ar(t){var e=Xn(()=>Dt(t));for(var n of e)if((n.f&mn)!==0)for(const r of n.deps||[])(r.f&x)===0&&Et(r,r.v);else Et(n,n.v)}function Dt(t){var e=R;try{return R=!0,t()}finally{R=e}}const te=-7169;function A(t,e){t.f=t.f&te|e}function lr(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(M in t)Tt(t);else if(!Array.isArray(t))for(let e in t){const n=t[e];typeof n=="object"&&n&&M in n&&Tt(n)}}}function Tt(t,e=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!e.has(t)){e.add(t),t instanceof Date&&t.getTime();for(let r in t)try{Tt(t[r],e)}catch{}const n=qt(t);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const r=wn(n);for(let a in r){const l=r[a].get;if(l)try{l.call(t)}catch{}}}}}export{mn as $,ie as A,gt as B,mt as C,Ln as D,Ht as E,h as F,xe as G,Le as H,J as I,kn as J,Nn as K,Ye as L,Me as M,tr as N,Bn as O,tn as P,It as Q,nr as R,M as S,Te as T,E as U,Pe as V,D as W,jn as X,ee as Y,Z,oe as _,Xe as a,Ce as a0,Ee as a1,Vt as a2,H as a3,ge as a4,se as a5,ye as a6,we as a7,me as a8,re as a9,ce as aA,Et as aB,an as aC,Un as aD,de as aE,be as aF,Ae as aG,fe as aH,er as aI,wn as aJ,vt as aK,ke as aL,Ke as aM,ar as aN,je as aO,Je as aP,Qe as aQ,De as aR,Re as aS,Ie as aT,Rt as aa,Fe as ab,P as ac,Ge as ad,U as ae,ft as af,v as ag,hn as ah,He as ai,Y as aj,Gt as ak,Cn as al,Jt as am,ue as an,ne as ao,ze as ap,Wn as aq,k as ar,rr as as,Ne as at,qt as au,yn as av,pe as aw,B as ax,ve as ay,he as az,Yn as b,I as c,j as d,p as e,Ze as f,Dt as g,q as h,le as i,F as j,lr as k,bt as l,_e as m,ae as n,Ue as o,Oe as p,Se as q,jt as r,Be as s,We as t,$e as u,qe as v,Ve as w,xn as x,Pn as y,ct as z};
