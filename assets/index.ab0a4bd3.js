var I=Object.defineProperty;var f=Object.getOwnPropertySymbols;var b=Object.prototype.hasOwnProperty,g=Object.prototype.propertyIsEnumerable;var m=(e,n,t)=>n in e?I(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,d=(e,n)=>{for(var t in n||(n={}))b.call(n,t)&&m(e,t,n[t]);if(f)for(var t of f(n))g.call(n,t)&&m(e,t,n[t]);return e};const w=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}};w();function h(e,n){return e.filter(t=>t.id===n)[0]}function N(e,n){return e.filter(t=>t.id!==n)}function x(e,n){const t=$(e,n);return p(t)?[...e,t]:e}function L(e,n,t){const s=e.findIndex(r=>r.id===n);if(s<0)return e;const o=d(d({},e[s]),t);return p(o)?[...e.slice(0,s),o,...e.slice(s+1)]:e}function $(e,n){return{id:`${e.reduce((o,r)=>Math.max(o,parseInt(r.id,10)),Number.MIN_VALUE)+1}`,name:n,done:!1}}function p(e){return!(!e.id||!e.name)}const y="items";async function l(e){const n=JSON.stringify(e);window.localStorage.setItem(y,n)}async function v(){var t;const e=(t=window.localStorage.getItem(y))!=null?t:"[]";return JSON.parse(e)}const S=document.querySelector("#app");let i=[],u;function E(){return`<form class="add-form">
    <input type="text" />
    <button type="submit" class="add-button">+</button>
  </form>`}function F(e){return`<button class="delete-button" data-id="${e}">\u2716\uFE0F</button>`}function O(e){return`<li class="list-item ${e.done?"done":""}"  data-id="${e.id}">
  <span>\u{1F4CC} ${e.name} ${e.done?"\u2714\uFE0F":""}</span>
  ${F(e.id)}
</li>`}function c(){S.innerHTML=`
    <ul class="list">
      ${i.map(e=>O(e)).join("")}
    </ul>
    ${E()}
  `,u=document.querySelector(".add-form input[type=text]")}async function C(e){const n=e.dataset.id;if(!n)return;const t=h(i,n);!t||(i=L(i,n,{done:!t.done}),c(),await l(i))}async function k(e){e.preventDefault();const n=u.value,t=x(i,n);t!==i&&(i=t,u.value="",c(),await l(i),u.focus())}async function A(e,n){e.preventDefault(),e.stopPropagation();const t=n.dataset.id;!t||(i=N(i,t),c(),await l(i))}function M(){document.addEventListener("click",e=>{const n=".add-button, .delete-button, .list-item",t=e.target.closest(n);!t||(t.className.includes("add-button")?k(e):t.className.includes("delete-button")?A(e,t):t.className.includes("list-item")&&C(t))})}M();v().then(e=>{i=e,c()}).catch(e=>{console.error(e)});