(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{38:function(e,n,t){},39:function(e,n,t){"use strict";t.r(n);var r=t(14),c=t.n(r),a=t(3),o=t(2),u=t(4),s=t.n(u),i="/api/persons",l={getAll:function(){return s.a.get(i).then((function(e){return e.data}))},create:function(e){return s.a.post(i,e).then((function(e){return e.data}))},update:function(e,n){return s.a.put("".concat(i,"/").concat(e),n).then((function(e){return e.data}))},remove:function(e){return s.a.delete("".concat(i,"/").concat(e)).then((function(e){return e.data}))}},d=t(0),m=function(e){return Object(d.jsx)("ul",{children:e.persons.map((function(n){return Object(d.jsx)(j,{name:n.name,number:n.number,nameFilter:e.nameFilter,removePerson:e.removePerson},n.name)}))})},j=function(e){return e.name.toLowerCase().includes(e.nameFilter.toLowerCase())?Object(d.jsxs)("div",{children:[Object(d.jsxs)("li",{children:[e.name," ",e.number]}),Object(d.jsx)("button",{onClick:function(){return e.removePerson(e.name)},children:"remove"})]}):null},b=function(e){return Object(d.jsxs)("div",{children:["filter shown with",Object(d.jsx)("input",{value:e.nameFilter,onChange:e.handleNameFilterChange})]})},h=function(e){return Object(d.jsxs)("form",{onSubmit:e.addPerson,children:[Object(d.jsxs)("div",{children:["name: ",Object(d.jsx)("input",{value:e.newName,onChange:e.handleNameChange})]}),Object(d.jsxs)("div",{children:["number: ",Object(d.jsx)("input",{value:e.newNumber,onChange:e.handleNumberChange})]}),Object(d.jsx)("button",{type:"submit",children:"add"})]})},f=function(e){var n=e.message,t=e.type;return null===n?null:"error"===t?Object(d.jsx)("div",{className:"error",children:n}):Object(d.jsx)("div",{className:"success",children:n})},O=function(){var e=Object(o.useState)([]),n=Object(a.a)(e,2),t=n[0],r=n[1],c=Object(o.useState)(""),u=Object(a.a)(c,2),s=u[0],i=u[1],j=Object(o.useState)(""),O=Object(a.a)(j,2),v=O[0],p=O[1],x=Object(o.useState)(""),g=Object(a.a)(x,2),w=g[0],N=g[1],C=Object(o.useState)(null),F=Object(a.a)(C,2),k=F[0],P=F[1],S=Object(o.useState)(null),y=Object(a.a)(S,2),A=y[0],E=y[1];Object(o.useEffect)((function(){l.getAll().then((function(e){r(e)}))}),[]);var J=function(e,n){if("error"===n)return P(e),void setTimeout((function(){P(null)}),5e3);E(e),setTimeout((function(){E(null)}),5e3)};return Object(d.jsxs)("div",{children:[Object(d.jsx)("h2",{children:"Phonebook"}),Object(d.jsx)(f,{className:"success",message:A,type:"success"}),Object(d.jsx)(f,{className:"error",message:k,type:"error"}),Object(d.jsx)(b,{nameFilter:w,handleNameFilterChange:function(e){N(e.target.value)}}),Object(d.jsx)("h3",{children:"Add new number"}),Object(d.jsx)(h,{addPerson:function(e){e.preventDefault();var n=t.find((function(e){return e.name===s}));if(n){if(!window.confirm("".concat(n.name," is already added to the phonebook, replace the old number with the new one?")))return;var c={name:s,number:v};l.update(n.id,c).then((function(e){J("".concat(n.name,"'s number was updated"),"success"),r(t.map((function(t){return t.id!==n.id?t:e}))),i(""),p("")})).catch((function(e){console.log(e),J(e.response.data.error,"error")}))}else{var a={name:s,number:v};l.create(a).then((function(e){J("".concat(a.name," was added"),"success"),r(t.concat(e)),i(""),p("")})).catch((function(e){console.log(e),J(e.response.data.error,"error")}))}},newName:s,handleNameChange:function(e){i(e.target.value)},newNumber:v,handleNumberChange:function(e){p(e.target.value)}}),Object(d.jsx)("h3",{children:"Numbers"}),Object(d.jsx)(m,{persons:t,nameFilter:w,removePerson:function(e){if(window.confirm("Remove ".concat(e,"?"))){var n=t.find((function(n){return n.name===e}));l.remove(n.id).then((function(){J("".concat(n.name," was removed"),"success"),r(t.filter((function(e){return e.id!==n.id})))})).catch((function(e){console.log(e),J(e.response.data.error,"error"),r(t.filter((function(e){return e.id!==n.id})))}))}}})]})};t(38);c.a.render(Object(d.jsx)(O,{}),document.getElementById("root"))}},[[39,1,2]]]);
//# sourceMappingURL=main.f4762840.chunk.js.map