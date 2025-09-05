// fetch all lessons list
function fetchLessons(){
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
    .then(res => res.json())
    .then(json => showLessons(json.data));
}
// show lessons to the website
const lessonsCont = document.getElementById('lessons-container');
function showLessons(lessons){
    lessons.forEach(lesson => {
        const button = document.createElement('button');
        button.setAttribute('onclick', `fetchWordCards(${lesson.level_no})`);
        button.innerHTML = `<i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}`;
        button.classList.add('btn', 'btn-outline', 'btn-primary', 'lessons-btn', `lesson-btn-${lesson.level_no}`);
        lessonsCont.appendChild(button);
    });
}
fetchLessons();

// fetch words (for displaying as card)
function fetchWordCards(levelNo){
    inactiveAllBtn(); // remove active class from all lesson buttons
    const selectedButton = document.querySelector(`.lesson-btn-${levelNo}`);
    selectedButton.classList.add('btn-active'); // adding active class to selected button
    wordCards.innerHTML = '<span class="loading loading-dots loading-xl col-span-full mx-auto mt-12"></span>'; // show spinner/loader while fetching files
    const url = `https://openapi.programming-hero.com/api/level/${levelNo}`;
    fetch(url)
        .then(res => res.json())
        .then(json => showWordCards(json.data));
}

const wordCards = document.getElementById('word-cards');

// show cards of words (display cards)
const showWordCards = (words) => {
    wordCards.innerHTML = '';
    if(words.length <= 0){
        wordCards.innerHTML = `
        <section class="col-span-full px-3 py-8 bangla-font">
            <img src="assets/alert-error.png" alt="alert sign" class="mx-auto">
            <p class="my-4 text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h4 class="text-2xl md:text-3xl text-[#292524]">নেক্সট Lesson এ যান</h4>
        </section>
        `;
        return;
    }
    for (const word of words) {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-white', 'shadow-sm');
        card.innerHTML = `
        <div class="card-body lg:p-10">
            <h2 class="card-title text-3xl mx-auto">${word.word ? word.word : 'শব্দ পাওয়া যায়নি'}</h2>
            <p class="text-xl font-medium my-6">Meaning /Pronounciation</p>
            <h4 class="text-2xl lg:text-3xl font-semibold bangla-font text-[#18181B]">
                "${word.meaning ? word.meaning : 'শব্দার্থ পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation : 'উচ্চারণ পাওয়া যায়নি'}"
            </h4>
            <div class="card-actions justify-between mt-12">
                <button onclick="fetchWordDetails(${word.id})" class="btn bg-[#1A91FF20] text-2xl h-auto p-4 opacity-85 hover:opacity-100">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF20] text-2xl h-auto p-4 opacity-85 hover:opacity-100">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
        `;
        wordCards.appendChild(card);
    }
}

// make all lesson button inactive
const inactiveAllBtn = () => {
    const lessonsBtn = document.querySelectorAll('.lessons-btn');
    for(let i=0; i<lessonsBtn.length; i++){
        lessonsBtn[i].classList.remove('btn-active');
    }
}

// fetch word details // my_modal_5.showModal()
async function fetchWordDetails(id){
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const response = await fetch(url);
    const json = await response.json();
    modalContents(json.data);
}

// display modal contents
function modalContents(word){
    const modalCont = document.querySelector('.modal-contents');
    modalCont.innerHTML = `
    <h3 class="text-3xl md:text-4xl font-bold bangla-font">${word.word} ( <i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h3>
    <h5 class="font-semibold text-2xl mt-7 mb-2">Meaning</h5>
    <p class="bangla-font text-2xl font-medium">${word.meaning}</p>
    <h5 class="font-semibold text-2xl mt-7 mb-2">Example</h5>
    <p class="text-xl">${word.sentence}</p>
    <h5 class="text-2xl font-medium bangla-font mt-7 mb-2">সমার্থক শব্দ গুলো</h5>
    <div class="flex gap-2 flex-wrap">
    ${
        word.synonyms.map(syn => `<span class="bg-[#EDF7FF] py-2 px-4 rounded-lg border border-[#D7E4EF] inline-block">${syn}</span>`).join(' ')
    }
    </div>
    `;
    document.querySelector('#my_modal_5').showModal();
}

// search functionality
const searchInput = document.getElementById('search-value');
document.getElementById('search-button').addEventListener('click', async () => {
    const searchValue = searchInput.value.trim();
    if(!searchValue){
        alert('type something and then search!');
        return;
    }
    wordCards.innerHTML = '<span class="loading loading-dots loading-xl col-span-full mx-auto mt-12"></span>'; // show spinner/loader while fetching files
    const response = await fetch('https://openapi.programming-hero.com/api/words/all');
    const json = await response.json();
    const matchedWords = json.data.filter(word => word.word.includes(searchValue));
    showWordCards(matchedWords);
});

// speech lound function
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}