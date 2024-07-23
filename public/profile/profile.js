const token = localStorage.getItem('token');
const socket = io(`http://localhost:3000`);
socket.on('welcome', (data) => {
    console.log(data);
});
socket.on('userRegistered' , (user) => {
    console.log(`New user registered: ${user.username}`);
    getProfile()
});

socket.on('profileUpdated' , (user) => {
    console.log(`New user registered: ${user.username}`);
    allProfiles();
});


async function getProfile(){
    try{
        const response = await axios.get(`http://localhost:3000/users/profile`, {headers: { 'Authorization': token }});
        const profile = document.getElementById('profile')
        profile.innerText = `Welcome to Recipe Management, ${response.data.username}`;
    }catch (error) {
        console.error(error);
    }
};

document.getElementById('update-profile').addEventListener('submit' , async(event) => {
    event.preventDefault();
    const username = document.getElementById('update-username').value ;
    const email = document.getElementById('update-email').value;
    const updates= {};
    if(username) updates.username = username;
    if(email) updates.email = email;

    try{
        const response = await axios.put(`http://localhost:3000/users/update-profile` ,updates ,{headers: { 'Authorization': token }});
        getProfile()
    }catch (error) {
        console.error(error);
        alert('Failed to update your profile');
    }
});


async function allProfiles(){
    try{
        const response = await axios.get(`http://localhost:3000/users/get-all-profile`,{headers: { 'Authorization': token }});
        const profileDiv = document.getElementById('all-profiles')
        profileDiv.innerHTML='';
        const profiles = response.data.profiles;
        profiles.forEach(profile => {
                const div = document.createElement('div');
                div.classList.add('profile-card');
                div.innerHTML = `Username: ${profile.username}<br>Email: ${profile.email}`;
                profileDiv.appendChild(div);
        });
    }catch (error) {
        console.error(error);
        alert('Failed to fetch all profile');
    }
}

document.addEventListener('DOMContentLoaded',  () => {
     allProfiles(); 
     getProfile()
});
