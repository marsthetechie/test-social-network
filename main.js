// Get data from database
const getData = async () => {
    const response = await fetch('https://gist.githubusercontent.com/marsthetechie/c850639d54daba9494f0acea61414ad7/raw/680785b9e8057c866cfe7f6975fc14c3a74c4745/data.json');
    if (response.ok) {
        let jsonResponse = await response.json();
        return jsonResponse;
    }
}

// Make an array for all people in a database
let peopleArr = [];

// Show everything on a page
const showPeople = people => {
    const fill = document.getElementById('people');

    const showFriends = id => {
        const prijatelji = document.getElementById('friends');
        prijatelji.innerHTML = '';

        const prijateljiPrijatelja = document.getElementById('fof');
        prijateljiPrijatelja.innerHTML = '';

        const predlozeniPrijatelji = document.getElementById('suggested');
        predlozeniPrijatelji.innerHTML = '';

        let currPerson;
        let currPersonFriends;

        let fofArr = [];
        let suggestedArr = [];

        // Holds current selected person
        peopleArr.forEach(person => {
            if (person.id === parseInt(id)) {
                currPerson = person;
            }
        });

        // Return objects (persons) from id's
        const addFriends = arr => {
            let personIdsArr = [];
            arr.forEach(id => {
                peopleArr.forEach(person => {
                    if (person.id === id) {
                        personIdsArr.push(person);
                    }
                })
            })
            return personIdsArr;
        }

        if (currPerson) {
            currPersonFriends = addFriends(currPerson.friends);
        }

        // Find friends of friends and suggested friends
        currPersonFriends.forEach(personFriends => {
            personFriends.friends.forEach(friendId => {
                if (friendId !== parseInt(id)) {
                    if (!currPerson.friends.includes(friendId)) {
                        if (fofArr.includes(friendId)) {
                            if (!suggestedArr.includes(friendId)) {
                                suggestedArr.push(friendId);
                            }
                        } else {
                            fofArr.push(friendId);
                        }
                    }
                }

            });

        })

        // Show friends of friends
        let friendsOfFriendsArr = addFriends(fofArr);
        friendsOfFriendsArr.forEach(friend => {
            const user = document.createElement('p');
            user.innerHTML = friend.firstName + ' ' + friend.surname;
            user.setAttribute('class', 'card');

            prijateljiPrijatelja.appendChild(user);
        })

        // Show suggested friends
        let suggestedFriendsArr = addFriends(suggestedArr);
        suggestedFriendsArr.forEach(friend => {
            const user = document.createElement('p');
            user.innerHTML = friend.firstName + ' ' + friend.surname;
            user.setAttribute('class', 'card');

            predlozeniPrijatelji.appendChild(user);
        })

        // Show direct friends
        currPersonFriends.forEach(friend => {
            const user = document.createElement('p');
            user.innerHTML = friend.firstName + ' ' + friend.surname;
            user.setAttribute('class', 'card');

            prijatelji.appendChild(user);
        })
    }

    // Show all persons' info
    people.forEach(person => {
        peopleArr.push(person);

        const user = document.createElement('p');
        user.innerHTML = person.firstName + ' ' + person.surname;
        user.setAttribute('class', 'card');
        user.setAttribute('id', person.id);

        user.addEventListener('click', event => {
            showFriends(event.target.id);
        })
        fill.appendChild(user);
    });
}



getData().then(result => {
    showPeople(result);
})