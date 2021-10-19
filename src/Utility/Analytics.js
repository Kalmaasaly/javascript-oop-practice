/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */

const intervalId = setInterval(() => {
    console.log('Sending analytics data...');
},
2000);

document.getElementById('stop-analytics-btn').addEventListener('click',
    () => {
        clearInterval(intervalId);
    });
