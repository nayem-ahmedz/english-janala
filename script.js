// show lessons
function fetchLessons(){
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
    .then(res => res.json())
    .then(json => showLessons(json.data));
}
const lessonsCont = document.getElementById('lessons-container');
function showLessons(lessons){
    lessons.forEach(lesson => {
        const button = document.createElement('button');
        button.innerHTML = `<i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}`;
        button.classList.add('btn', 'btn-outline', 'btn-primary');
        lessonsCont.appendChild(button);
    });
}
fetchLessons();