// fetch all lessons
function fetchLessons(){
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
    .then(res => res.json())
    .then(json => showLessons(json.data));
}
// show lessons
const lessonsCont = document.getElementById('lessons-container');
function showLessons(lessons){
    lessons.forEach(lesson => {
        const button = document.createElement('button');
        button.setAttribute('onclick', `fetchWordCards(${lesson.level_no})`);
        button.innerHTML = `<i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}`;
        button.classList.add('btn', 'btn-outline', 'btn-primary');
        lessonsCont.appendChild(button);
    });
}
fetchLessons();

// fetch words
function fetchWordCards(levelNo){
    const url = `https://openapi.programming-hero.com/api/level/${levelNo}`;
    fetch(url)
        .then(res => res.json())
        .then(json => showWordCards(json.data));
}
const wordCards = document.getElementById('word-cards');
// show cards of words
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
                <button class="btn bg-[#1A91FF20] text-2xl h-auto p-4 opacity-85 hover:opacity-100">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button class="btn bg-[#1A91FF20] text-2xl h-auto p-4 opacity-85 hover:opacity-100">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
        `;
        wordCards.appendChild(card);
    }
}