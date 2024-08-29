document.addEventListener('DOMContentLoaded', () => {
    const logsTable = document.getElementById('logsTable').getElementsByTagName('tbody')[0];
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const addDataForm = document.getElementById('addDataForm');

    // Fetch and display logs from the `logs` table in the database
    fetch('/api/Logs')
        .then(response => response.json())
        .then(data => {
            data.forEach(log => {
                if (log.process_status === 'Processed') {
                const row = logsTable.insertRow();
                //const row = logsTable.insertRow();
                row.insertCell(0).innerText = log.id;
                row.insertCell(1).innerText = log.employee_num;
                row.insertCell(2).innerText = log.log_date;
                row.insertCell(3).innerText = log.process_status;
                row.insertCell(4).innerText = log.ohrm_id;
                }
            });
        })
        .catch(error => console.error('Error fetching logs:', error));

    // Fetch and display logs from the `addData` table in the database
    fetch('/api/Logs')
        .then(response => response.json())
        .then(data => {
            data.forEach(log => {
                if (log.process_status === 'Unprocessed') {
                const row = dataTable.insertRow();
                row.insertCell(0).innerText = log.id;
                row.insertCell(1).innerText = log.employee_num;
                row.insertCell(2).innerText = log.log_date;
                row.insertCell(3).innerText = log.device_desc;
                row.insertCell(4).innerText = log.process_status;
                //row.insertCell(5).innerText = log.ohrm_id;

                // Create and append the delete button
                const deleteCell = row.insertCell(5);
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', () => deleteLog(log.id, row));
                deleteCell.appendChild(deleteButton);
                }
            });
        })
        .catch(error => console.error('Error fetching addData:', error));

    // Add new log entry to the addData table
    addDataForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            employee_num: document.getElementById('employee_num').value,
            log_date: document.getElementById('log_date').value,
            device_desc: document.getElementById('device_desc').value,
            process_status: document.getElementById('process_status').value,
            
        };

        fetch('/addData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Log entry added successfully!');

            // Append the new entry to the table
            const row = dataTable.insertRow();
            row.insertCell(0).innerText = data.id; // This is the newly inserted record's ID returned by the server
            row.insertCell(1).innerText = formData.employee_num;
            row.insertCell(2).innerText = formData.log_date;
            row.insertCell(3).innerText = formData.device_desc;
            row.insertCell(4).innerText = formData.process_status;
            //row.insertCell(5).innerText = formData.ohrm_id;

            // Create and append the delete button
            const deleteCell = row.insertCell(5);
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => deleteLog(data.id, row));
            deleteCell.appendChild(deleteButton);

            // Clear the form
            addDataForm.reset();
        })
        .catch(error => console.error('Error adding log entry:', error));
    });

    function deleteLog(id, row) {
        if (confirm('Are you sure you want to delete this log?')) {
            fetch(`/delete-log/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    dataTable.removeChild(row);
                } else {
                    alert('Failed to delete the log.');
                }
            })
            .catch(error => console.error('Error deleting log:', error));
        }
    }
});
