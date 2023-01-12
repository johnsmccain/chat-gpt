import { messages, lon } from "./message.js";

let loadInterval;

function loader(element) {
        element.textContent = '';
        // console.log(element)
        loadInterval = setInterval(() => {
                element.textContent += '.';
                
                if (element.textContent === '....') {
                        element.textContent = '';
                }
        }, 300)
}



const typeText = (element, text, chatBox='') => {
        let index = 0;
        element.innerHTML = "";
        let height = chatBox.scrollHeight
        const interval = setInterval(() => {
                if(chatBox.scrollHeight > height) {
                        height = chatBox.scrollHeight
                        chatBox.scrollTop = chatBox.scrollHeight 
                } 
                if(index < text.length){
                        element.innerHTML += text.charAt(index);
                        index ++;
                } else{
                        clearInterval(interval);
                };
        }, 20)
        
}

const gUniqueId = () => {
        let rand = Math.random();
        let time = Date.now();
        const hexadecimalString = rand.toString(16);
        return `id-${hexadecimalString}-${time}`;
}

const chatStripe = (owner, value, uniqueId) => {
        return (
                `
                        <div class="message ${owner}">
                                <div id=${uniqueId}> ${value}</div>
                        </div>
                `
        )
}

let chatBox = document.querySelector(".chat-box");
let msg = document.querySelector("textarea");
let form = document.querySelector("form")

const handleSubmit = async(e) => {
        e.preventDefault();

        const data = new FormData(form);

        chatBox.innerHTML += chatStripe("me", data.get('prompt'));
        if (data.get('prompt') === ''){
                return
        }
        console.log(data.get("prompt"))
        form.reset();
        // console.log(chatStripe("me", data.get('prompt')))
        // console.log(form)
        const uniqueId = gUniqueId()
        chatBox.innerHTML += chatStripe("ai", data.get('prompt'), uniqueId);
        
        // console.log(chatStripe("ai", data.get('prompt'), uniqueId))
        chatBox.scrollTop = chatBox.scrollHeight;

        const messageDiv = document.getElementById(uniqueId);
        loader(messageDiv)

        const response =  await fetch("https://chat-ai-s7zv.onrender.com/",{
                method: "POST",
                headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                        prompt: data.get("prompt")
                })
        })

        if(response.ok) {
                const data = await response.json()
                // console.log(data.bot)
                clearInterval(loadInterval)
                typeText(messageDiv, data.bot, chatBox)

        }
                // console.log("cleared!")
        // messageDiv.textContent = ''
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
                handleSubmit(e);
        }
});

