let modalQt = 1
let modalKey = 0
let cart = []

let pegarElemento = (el) => document.querySelector(el)
let arrayElemento = (el) => document.querySelectorAll(el)

pizzaJson.map((item, index) => {
    let pizzaItem = pegarElemento(".models .pizza-item").cloneNode(true)
    pegarElemento(".pizza-area").append(pizzaItem)

    pizzaItem.setAttribute("data-key", index)
    pizzaItem.querySelector(".pizza-item--img img").src = item.img
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2).replace(".", ",")}`
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description
    pizzaItem.querySelector("a").addEventListener('click', (e) => {
        e.preventDefault()
        let key = e.target.closest(".pizza-item").getAttribute("data-key")
        modalQt = 1
        modalKey = key

        pegarElemento(".pizzaBig img").src = pizzaJson[key].img
        pegarElemento(".pizzaInfo h1").innerHTML = pizzaJson[key].name
        pegarElemento(".pizzaInfo--desc").innerHTML = pizzaJson[key].description
        pegarElemento(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace(".", ",")}`
        pegarElemento(".pizzaInfo--size.selected").classList.remove("selected")
        arrayElemento(".pizzaInfo--size").forEach((size, indexsize) =>{
            if(indexsize == 2){
                size.classList.add("selected")
            }
            pegarElemento(".pizzaInfo--qt").innerHTML = modalQt
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[indexsize]
        })
        pegarElemento(".pizzaWindowArea").style.opacity = "0"
        pegarElemento(".pizzaWindowArea").style.display = "flex"
        setTimeout(() =>{
            pegarElemento(".pizzaWindowArea").style.opacity = "1"
        }, 50)

    })
})

// Recursos do modal

function fecharModal(){
    pegarElemento(".pizzaWindowArea").style.opacity = "0"
    setTimeout(() => {
        pegarElemento(".pizzaWindowArea").style.display = "none"
    }, 1000)
}

let elem = arrayElemento(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton")
elem.forEach((item) => {
    item.addEventListener('click', fecharModal)
})

pegarElemento(".pizzaInfo--qtmais").addEventListener('click', () => {
    modalQt++
    pegarElemento(".pizzaInfo--qt").innerHTML = modalQt
})

pegarElemento(".pizzaInfo--qtmenos").addEventListener('click', () => {
    if(modalQt > 1){
        modalQt--
        pegarElemento(".pizzaInfo--qt").innerHTML = modalQt
    }
})
arrayElemento(".pizzaInfo--size").forEach((size) => {
    size.addEventListener('click', () => {
        pegarElemento(".pizzaInfo--size.selected").classList.remove("selected")
        size.classList.add("selected")
    })
})
pegarElemento(".pizzaInfo--addButton").addEventListener('click', () => {
    let size = parseInt(pegarElemento(".pizzaInfo--size.selected").getAttribute("data-key"))
    let identifier = pizzaJson[modalKey].id+'@'+size
    let key = cart.findIndex((item) => item.identifier == identifier)
    if(key > - 1){
        cart[key].qt += modalQt
    }else{
        cart.push({
            identifier,
            name:pizzaJson[modalKey].name,
            size:size,
            qt:modalQt
        })
    }
    updateCart()
    fecharModal()
})
function updateCart(){
    if(cart.length > 0){
        pegarElemento("aside").classList.add("show")
        pegarElemento(".cart").innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart){
            let pizzaItem = pizzaJson.find((x) => x.name == cart[i].name)
            let cartItem = pegarElemento(".models .cart--item").cloneNode(true)
            subtotal += pizzaItem.price * cart[i].qt

            let pizzaName = `${cart[i].size}`

            switch(cart[i].size){
                case 0:
                    pizzaName = "P"
                    break;
                case 1:
                    pizzaName = "M"
                    break;
                case 2:
                    pizzaName = "G"
            }

            cartItem.querySelector("img").src = pizzaItem.img
            cartItem.querySelector(".cart--item-nome").innerHTML = `${pizzaItem.name} (${pizzaName})`
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt
            cartItem.querySelector(".cart--item-qtmenos").addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--
                }else{
                    cart.splice(i, 1)
                }
            updateCart()
            })
            cartItem.querySelector(".cart--item-qtmais").addEventListener('click', () => {
                    cart[i].qt++
                    let resultadoSub = pizzaItem.price * cart[i].qt
                    let resultadoTot = resultadoSub - desconto
                    pegarElemento(".subtotal span:last-child").innerHTML = `R$ ${resultadoSub.toFixed(2).replace(".", ",")}`
                    pegarElemento(".total span:last-child").innerHTML = `R$ ${resultadoTot.toFixed(2).replace(".", ",")}`
                    cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt
            })
            pegarElemento(".cart").append(cartItem)

        }
        desconto = subtotal * 0.1
        total = subtotal - desconto
        pegarElemento(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2).replace(".", ",")}`
        pegarElemento(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2).replace(".", ",")}`
        pegarElemento(".total span:last-child").innerHTML = `R$ ${total.toFixed(2).replace(".", ",")}`
    }else{
        pegarElemento("aside").classList.remove("show")
        pegarElemento("aside").style.left = "100vw"
        pegarElemento(".menu-openner span").innerHTML = 0
    }
}
updateCart()

pegarElemento(".menu-openner span").addEventListener('click', () => {
    if(cart.length > 0){
        pegarElemento("aside").style.left = "0"
    }
})
pegarElemento(".menu-closer").addEventListener('click', () => {
    pegarElemento("aside").style.left = "100vw"
})
pegarElemento(".pizzaInfo--addButton").addEventListener('click', () => {
    pegarElemento(".menu-openner span").innerHTML = cart.length
})