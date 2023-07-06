import user1 from '../assets/images/users/user1.png';
import user2 from '../assets/images/users/user2.png';
import user3 from '../assets/images/users/user3.png';
import user4 from '../assets/images/users/user4.png';
import user5 from '../assets/images/users/user5.png';
import user6 from '../assets/images/users/user6.png';
import user7 from '../assets/images/users/user7.png';


export const getRandomeUserImage = () => {
    const userImages = [user1, user2, user3, user4, user5, user6, user7];
    const userAvatarIndex = Math.floor((Math.random() * 6) ) + 1
    return userImages[userAvatarIndex];
}

export const specialityList = [
    { label: 'YOGA', value: 'YOGA' },
    { label: 'FITNESS', value: 'FITNESS' },
    { label: 'POWERLIFTING', value: 'POWERLIFTING' }
];


export const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sup', 'Oct', 'Nov', 'Des'];

export const daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const dateObj = new Date();

export const todayDate = `${daysList[dateObj.getUTCDay()]} ${dateObj.getUTCDate()} ${monthsList[dateObj.getUTCMonth()]}`;

export const currentTime = `${dateObj.getUTCHours()}:${dateObj.getUTCMinutes()}`;
