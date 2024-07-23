const socket = io(`http://localhost:3000`);
socket.on('welcome', (data) => {
    console.log(data);
});

socket.on('userRegistered' , (user) => {
    console.log(`New user registered: ${user.username}`);
});


document.getElementById('signupForm').addEventListener ('submit',async (event) => {
    event.preventDefault();
    const signupDetails = {
        username:event.target.username.value,
        email:event.target.email.value,
        password:event.target.password.value,
    }; 
    console.log(signupDetails)
    try{
        const response = await axios.post('http://localhost:3000/users/signup', signupDetails);
        alert('Succesfully signed');
        window.location.href = '../login/login.html';
    }catch(error){
        console.error('Error signing up:', error);
        alert('Signup failed. Please check your details and try again.');
    }
});
