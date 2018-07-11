
const devices = JSON.parse(localStorage.getItem('devices')) || [];
// const devices = [];

for (let key of devices) {
    $('#devices tbody').append(`
    <tr>
    <td>${key.User}</td>
    <td>${key.Name}</td>
    </tr>`);   
};
// comment
$('#add-device').on('click', function(){
    const user1 = $('#user').val();
    const name1 = $('#name').val()
    devices.push({User: user1, Name: name1})
    localStorage.setItem('devices', JSON.stringify(devices));
    console.log(devices);
    location.href = "device-list.html"
});

$('#send-command').on('click', function() {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
   });
   


