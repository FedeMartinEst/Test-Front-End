
buscarProductos();

document.querySelectorAll(".subscribe input").forEach((elem)=>{
    elem.addEventListener('focus',function(){
        if(elem.classList.contains('error')){
            elem.classList.remove('error');
        }
    })
});

document.querySelectorAll(".cant-carrito").forEach((elem)=>{
    if(localStorage.getItem('listaCarrito')){
        var cantidad=JSON.parse(localStorage.getItem('listaCarrito')).length;
        elem.innerText=cantidad>0?cantidad:'';
    }
    
})


function buscarProductos(){
    fetch("https://corebiz-test.herokuapp.com/api/v1/products",{method:"get"})
    .then((resp)=>{
        if(resp.ok) return resp.text();
        else console.error(resp.statusText);
    })
    .then((productos)=>{
        productos=JSON.parse(productos);
        for(item in productos){
            agregarProducto(productos[item]);
        }
    })
    .catch(function (error){
        console.error(error);
    })
}

function agregarProducto(producto){
    var item=document.createElement('div');
    item.className=" item text-center col-md col-6";
    item.addEventListener('mouseover',function(){
        seleccionarProducto(this);
    });
    item.innerHTML=
        
            '<div><img class="img" src="'+producto.imageUrl+'" alt=""></div>'+
            '<div class="info">'+
                '<p class="item-name">'+
                    producto.productName+
                '</p>'+
                '<div class="item-satrs">'+

                '</div>'+
                ((producto.listPrice)? '<p class="item-price"> de $ ' + producto.listPrice + '</p>':'') +
                '<p class="item-price-discount"> por $ '+
                    producto.price +
                '</p>'+
                (producto.installments[0]?
                '<p class="item-price-dues"> o en '+
                    producto.installments[0].quantity+ 'x de $ '+ producto.installments[0].value +
                '</p>' :'') +
                ((JSON.parse(localStorage.getItem('listaCarrito')) && JSON.parse(localStorage.getItem('listaCarrito')).find(item=>item==producto.productId))?
                '<button class="item-buy btn select" onclick="cargarProducto(this,'+producto.productId+')">Quitar</button>':
                '<button class="item-buy btn " onclick="cargarProducto(this,'+producto.productId+')">Comprar</button>'
                )+
            '</div>'
    ;
    document.querySelector('.item-list').appendChild(item);
}

function seleccionarProducto(producto){
    if(document.querySelector('.item.select')){
        document.querySelector('.item.select').classList.remove('select');
    }
    producto.classList.add('select');
}

function cargarProducto(elem,id){
    if(elem.classList.toggle('select')){
        elem.innerText="Quitar";
    }
    else{
        elem.innerText="Comprar";
    }
    var lista;
    if(lista=JSON.parse(localStorage.getItem('listaCarrito'))){
        var index=lista.findIndex(item=>item==id);
        if(index<0){
            lista.push(id);
            
        }
        else{
            lista.splice(index,1);
            
        }
        document.querySelectorAll(".cant-carrito").forEach((elem)=>{
            elem.innerText=lista.length>0?lista.length:'';
        });
        localStorage.setItem('listaCarrito',JSON.stringify(lista));
    }
    else{
        var listaCarrito=[id];
        localStorage.setItem('listaCarrito',JSON.stringify(listaCarrito));
        document.querySelectorAll(".cant-carrito").forEach((elem)=>{
            elem.innerText=1;
        });
    }
}

function validarEmail(email){
    
    if(email.match(/^\w{1,}@\w{1,}(.com(.\w{0,}|)|.\w{1,})$/)){
        return true;
    }
    document.querySelector("[name='email']").classList.add("error");
    return false;
}

function validarNombre(nombre){
    if(nombre.match(/^\w{2,}/)){
        return true;
    }
    document.querySelector("[name='name']").classList.add("error");
    return false;
}

function suscribir(){
    var email=document.querySelector("[name='email']").value;
    var nombre=document.querySelector("[name='name']").value;

    if(validarNombre(nombre) && validarEmail(email)){
        var enviar={
            name:nombre,
            email:email
        }

        fetch("https://corebiz-test.herokuapp.com/api/v1/newsletter",{method:"post",body:JSON.stringify(enviar)})
        .then((resp)=>{
            if(resp) return resp.text();
            else console.error(resp.statusText);
        })
        .then((resp)=>{
            console.log(resp);
        })
    }
}