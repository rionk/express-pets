async function start() {
	const weatherPromise = await fetch("https://api.weather.gov/gridpoints/MFL/110,50/forecast")
	const weatherData = await weatherPromise.json()

	const ourTemperature = weatherData.properties.periods[0].temperature
	document.querySelector("#temperature-output").textContent = ourTemperature

}

start()

// pet filter button code
const allButtons = document.querySelectorAll(".pet-filter button")

allButtons.forEach(el => {
	el.addEventListener("click", handleButtonClick)
})

function handleButtonClick(e) {
	// remove active class from any and all buttons
	allButtons.forEach(el => el.classList.remove("active"))

	// add active class to the specific button that just got clicked
	e.target.classList.add("active")

	// actually filter the pets down below
	const currentFilter = e.target.dataset.filter
	document.querySelectorAll(".pet-card").forEach(el => {
		if (currentFilter == el.dataset.species || currentFilter == "all") {
			el.style.display = "grid"
		} else {
			el.style.display = "none"
		}
	})
}

const overlay = document.querySelector('.form-overlay');
overlay.hidden = false;

document.querySelector('.form-content').addEventListener('submit', async function (e) {
	e.preventDefault();
	const data = new FormData(this)
	const userValue ={
		name: data.get('name'),
		email: data.get('email'),
		secret: data.get('secret'),
		comment: data.get('comment'),
		id: this.dataset.id
	};

	const response = await fetch('/submit-contact', {
		method: "POST",
		headers : {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(userValue)
	})

	const resData = await response.json();
	console.log(resData)

	document.querySelector('.thank-you').classList.add('thank-you--visible')

	setTimeout(()=> {
		closeOverlay()
		document.querySelector('.thank-you').classList.remove('thank-you--visible')
		this.reset()
	}, 2500)
})

function openOverlay(el){
	const overlay = document.querySelector('.form-overlay');
	overlay.classList.add('form-overlay--is-visible')
	overlay.querySelector('.form-content').dataset.id = el.dataset.id
	overlay.querySelector('.form-photo p strong').textContent = el.closest('.pet-card').querySelector('.pet-name').textContent
	overlay.querySelector('.form-photo img').src = el.closest('.pet-card').querySelector('.pet-card-photo img').src;

	document.documentElement.style.overflowY = "hidden"
}

function closeOverlay(e){
	e && e.preventDefault()
	overlay.classList.remove('form-overlay--is-visible')
	document.documentElement.style.overflowY = ""

}