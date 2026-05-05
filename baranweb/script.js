
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if(hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        const icon = hamburger.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}


let currentLang = localStorage.getItem('siteLang') || 'tr';

const botKnowledge = {
    tr: {
        greeting: "Sistem aktif. Size nasıl yardımcı olabilirim? Aşağıdaki hızlı komutları kullanabilirsiniz.",
        unknown: "Komut anlaşılamadı. Lütfen geçerli bir işlem belirtin veya hızlı butonları kullanın.",
        replies: {
            "kimsin?": "Ben Süleyman Baran Almaz'ın dijital asistanıyım. Kendisi 19 yaşında, Sinop Üniversitesi öğrencisi ve motor tutkunu bir geliştiricidir.",
            "iletişim": "İletişim sayfasına gitmek için menüyü kullanabilirsiniz. Instagram, WhatsApp veya E-posta üzerinden ulaşabilirsiniz.",
            "galeri": "Motor ve teknoloji galerisine menüden ulaşabilirsiniz.",
            "neler yaparsın?": "HTML, CSS, JS ve Ağ Teknolojileri üzerine çalışıyorum. Aynı zamanda motor sürmeyi ve yeni teknolojileri keşfetmeyi severim."
        },
        quickOptions: ["Kimsin?", "İletişim", "Galeri", "Neler yaparsın?"]
    },
    en: {
        greeting: "System active. How can I assist? You can use the quick commands below.",
        unknown: "Command not recognized. Please specify a valid operation or use the quick buttons.",
        replies: {
            "who are you?": "I am the digital assistant of Süleyman Baran Almaz. He is a 19-year-old student at Sinop University and a moto-tech enthusiast.",
            "contact": "You can use the menu to go to the Contact page. You can reach out via Instagram, WhatsApp, or Email.",
            "gallery": "You can access the Moto & Tech gallery from the menu.",
            "what do you do?": "I work on HTML, CSS, JS, and Network Technologies. I also love riding motorcycles and exploring new tech."
        },
        quickOptions: ["Who are you?", "Contact", "Gallery", "What do you do?"]
    }
};

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang); 
    
  
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(el => {
        if(el.querySelector('i')) {
             const icon = el.querySelector('i').outerHTML;
   
             const text = el.getAttribute('data-' + lang);
             el.innerHTML = icon + ' ' + text;
        } else {
            el.textContent = el.getAttribute('data-' + lang);
        }
    });

  
    const inputs = document.querySelectorAll('[data-placeholder-' + lang + ']');
    inputs.forEach(input => {
        input.placeholder = input.getAttribute('data-placeholder-' + lang);
    });


    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('lang-' + lang);
    if(activeBtn) activeBtn.classList.add('active');


    if(document.getElementById('chatbot').classList.contains('open')) {
        renderQuickReplies();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
});

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('open');
    
    const messages = document.getElementById('messages');
    if (chatbot.classList.contains('open') && messages.children.length === 0) {
        const greeting = currentLang === 'tr' ? botKnowledge.tr.greeting : botKnowledge.en.greeting;
        addMessage('bot', greeting);
        renderQuickReplies();
    }
}

function renderQuickReplies() {
    const container = document.getElementById('quickReplies');
    if(!container) return;
    container.innerHTML = '';
    
    const options = currentLang === 'tr' ? botKnowledge.tr.quickOptions : botKnowledge.en.quickOptions;
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = opt;
        btn.onclick = () => handleQuickReply(opt);
        container.appendChild(btn);
    });
}

function handleQuickReply(text) {
    addMessage('user', text);
    processBotResponse(text);
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (text) {
        addMessage('user', text);
        input.value = '';
        processBotResponse(text);
    }
}

function processBotResponse(input) {
    const langData = currentLang === 'tr' ? botKnowledge.tr : botKnowledge.en;
    const lowerInput = input.toLowerCase();
    
    let reply = langData.unknown;
    let action = null;

    for (const [key, value] of Object.entries(langData.replies)) {
        if (lowerInput.includes(key.toLowerCase()) || lowerInput === key.toLowerCase()) {
            reply = value;
            if (key.includes("iletişim") || key.includes("contact")) action = 'iletisim.html';
            if (key.includes("galeri") || key.includes("gallery")) action = 'galeri.html';
            break;
        }
    }

    setTimeout(() => {
        addMessage('bot', reply);
        if (action) {
            window.location.href = action;
        }
    }, 600);
}

function addMessage(sender, text) {
    const messages = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

const chatInput = document.getElementById('chatInput');
if(chatInput) {
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function submitForm(form) {
    const msg = currentLang === 'tr' 
        ? "Mesajınız şifrelendi ve başarıyla iletildi! En kısa sürede dönüş sağlanacaktır."
        : "Your message has been encrypted and sent successfully! We will get back to you soon.";
    alert(msg);
    form.reset();
}