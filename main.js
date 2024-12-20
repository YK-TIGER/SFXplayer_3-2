//I don't know why this code is open-sources. God Save Us. Thanks for joyhyunki and survibo!
//Website link: yk-tiger.github.io/player

let my_happines = 999999999999999999

document.addEventListener('DOMContentLoaded', () => {
    const playingSounds = new Set();
    const buttons = document.querySelectorAll('[data-sound]');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    let globalVolume = volumeSlider.value / 100;

    function updateVolume(value) {
        globalVolume = value / 100;
        volumeValue.textContent = `${value}%`;
        playingSounds.forEach(sound => {
            sound.audio.volume = globalVolume;
        });
    }

    updateVolume(volumeSlider.value);
    volumeSlider.addEventListener('input', (e) => updateVolume(e.target.value));

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const soundFile = button.dataset.sound;
            const existingSound = Array.from(playingSounds).find(
                info => info.button === button
            );

            if (existingSound) {
                // If sound is already playing, stop it
                existingSound.audio.pause();
                existingSound.audio.currentTime = 0; // Reset to the beginning
                playingSounds.delete(existingSound);
                button.classList.remove('active');
                return;
            }

            // Start playing the sound
            const audio = new Audio(soundFile);
            audio.volume = globalVolume;
            const audioInfo = { audio, button };
            playingSounds.add(audioInfo);
            button.classList.add('active');

            audio.play().catch(error => {
                console.error('Error playing sound:', error);
                playingSounds.delete(audioInfo);
                button.classList.remove('active');
            });

            audio.addEventListener('ended', () => {
                playingSounds.delete(audioInfo);
                button.classList.remove('active');
            });
        });
    });

    window.addEventListener('beforeunload', () => {
        playingSounds.forEach(({ audio }) => {
            audio.pause();
            audio.src = ""; // Release resources
        });
        playingSounds.clear();
    });
});
