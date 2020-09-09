const $inputText = document.querySelector("input[type='text']")
const $inputSubmit = document.querySelector("input[type='submit']")
const $messageContainer = document.querySelector('#message-container')

onGetImage = (result) => {
    $inputSubmit.style.cursor = result?'not-allowed':'pointer';
    $inputText.style.cursor = result?'not-allowed':'initial';
    $inputSubmit.disabled = result
    $inputText.disabled = result
}

window.addEventListener('submit', async (e) => {
    e.preventDefault()
    $messageContainer.textContent = 'Processing...'
    $messageContainer.style.color = 'white'
    onGetImage(true)
    await fetch(`/generate?uri=${$inputText.value}`)
    .then(response => {
        if (response.status == 200) {
            $messageContainer.style.color = 'green'
            $messageContainer.innerHTML = 'Generated!! <a href="/download">Click here to download</a>'
        }
        return response.json()
    })
    .then(data => {
        $messageContainer.style.color = 'red'
        $messageContainer.innerHTML = data.error
    })
    .finally(() => {
        onGetImage(false)
        $inputText.value = ''
    })
})