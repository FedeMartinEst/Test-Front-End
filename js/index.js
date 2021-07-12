
buscarProductos();

document.querySelectorAll(".subscribe input").forEach((elem)=>{
    elem.addEventListener('focus',function(){
        if(elem.classList.contains('error')){
            elem.classList.remove('error');
        }
    })
})


function buscarProductos(){
    fetch("https://corebiz-test.herokuapp.com/api/v1/products",{method:"get"})
    .then((resp)=>{
        if(resp.ok) return resp.text();
        else console.error(resp.statusText);
    })
    .then((productos)=>{
        if(!productos){
            productos='[{"productId": 1,"productName": "SAPATO FLOATER PRETO","stars": 1,"imageUrl": "https://corebiz-test.herokuapp.com/images/product-1.png","listPrice": null,"price": 25990,"installments": [{"quantity": 9,"value": 2887}]}]';
        }
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
    item.className=" text-center col-3";
    item.innerHTML=
        '<div class="item">'+
            '<div><img class="img" src="'+producto.imageUrl+'" alt=""></div>'+
            '<div class="info ">'+
                '<p class="item-name">'+
                    producto.productName+
                '</p>'+
                '<div class="item-satrs">'+

                '</div>'+
                ((producto.listPrice)? '<p class="item-price"> de' + producto.listPrice + '</p>': '<p></p>') +
                '<p class="item-price-discount"> por $ '+
                    producto.price +
                '</p>'+
                (producto.installments[0]?
                '<p class="item-price-dues"> o en '+
                    producto.installments[0].quantity+ 'x de $ '+ producto.installments[0].value +
                '</p>' :'') +
                
                '<button class="item-buy btn btn-dark">Comprar </button>'+ 

            '</div>'+
        '</div>'
    ;
    document.querySelector('.item-list').appendChild(item);
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