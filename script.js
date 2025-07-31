document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const form = document.getElementById('drug-form');
    const resultsList = document.getElementById('results-list');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submission triggered.');

        const drugName = document.getElementById('drug-name').value;
        const opeDay = document.getElementById('ope-day').value;

        console.log(`Drug Name: ${drugName}, Surgery Day: ${opeDay}`);

        const proxyUrl = '/api/dify';

        const requestData = {
            inputs: {
                drug_name: drugName,
                ope_day: opeDay.replace(/-/g, '/') // Format date to YYYY/MM/DD
            },
            response_mode: 'blocking',
            user: 'test-user-123' // A unique identifier for the end-user
        };

        console.log('Sending data to proxy:', JSON.stringify(requestData, null, 2));

        try {
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            console.log('Received response from Dify:', response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Dify API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Dify API Result:', result);

            // Assuming the response has a 'text' field with the result message
            if (result && result.data && result.data.outputs && result.data.outputs.text) {
                const resultText = result.data.outputs.text;
                const newListItem = document.createElement('li');
                newListItem.textContent = resultText;
                resultsList.appendChild(newListItem);
                console.log('Result displayed on the page.');
            } else {
                throw new Error('Invalid response format from Dify API');
            }

        } catch (error) {
            console.error('Error during Dify API call:', error);
            const errorItem = document.createElement('li');
            errorItem.textContent = `エラーが発生しました: ${error.message}`;
            errorItem.style.color = 'red';
            errorItem.style.borderLeftColor = 'red';
            resultsList.appendChild(errorItem);
        }
    });
});
