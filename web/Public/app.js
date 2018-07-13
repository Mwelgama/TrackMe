const devices = JSON.parse(localStorage.getItem('devices')) || [];
// const devices = [];
    // devices.push({User: "Mary", Name: "Mary's Phone"});
    // devices.push({User: "Alex", Name: "Alex's Surface Pro"});
    // devices.push({User: "Mary", Name: "Mary's Macbook"});

for (let key of devices) {
    $('#devices tbody').append(`
    <tr>
    <td>${key.User}</td>
    <td>${key.Name}</td>
    </tr>`);   
};

// commentdd
$('#add-device').on('click', function(){
    const user1 = $('#user').val();
    const name1 = $('#name').val()
    devices.push({User: user1, Name: name1})
    localStorage.setItem('devices', JSON.stringify(devices));
    console.log(devices);
    location.href = "/"
});

$('#send-command').on('click', function() {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
   });

$('#RegisterLogin').on('click', function() {
    const userName = $('#userName').val();
    const password1 = $('#password').val();
    const password2 = $('#passwordConfirm').val()
    // if(localStorage.getItem(user))
    //     console.log("User Already Exists.");
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.find((user => user.Name === userName));
    if (exists){
        $('#message').append('<p>User exists</p>');
        
    }
    else if (password1 !== password2){
        $('#message').append('<p>User exists</p>')
    }
    else
    {
        users.push({name: userName, password: password2})
        localStorage.setItem('users', JSON.stringify(users));
        location.href = "/login";
    }
   });

$('#navbar').load('navbar.html');
$('#footer').load('footer.html')

