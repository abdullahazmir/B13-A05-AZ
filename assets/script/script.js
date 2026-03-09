const createElements = (arr) => {
    const htmlElements = arr.map(el => `<div class=" badge bg-orange-300 badge-info">${el}</div>`);

    return htmlElements.join(" ")
};



const userName = document.getElementById('user-name')
const password = document.getElementById('password')
const loginSection = document.getElementById('login-section')
const mainSection = document.getElementById('main-section')
const issueContainer = document.getElementById('issue-container')
let issueNumber = document.getElementById('issue-number')



const btnSignIn = () => {
    const userName1 = userName.value;
    const password1 = password.value;
    //    console.log(userName1)
    //    console.log(password1)

    if (userName1 == 'admin' && password1 == 'admin123') {
        loginSection.classList.add('hidden');
        mainSection.classList.remove('hidden')

    } else {
        alert('wrong username or password');
        return;
    }
};

// toggle effect
function setActiveButton(clickedBtn) {

    const buttons = document.querySelectorAll('.filter-btn');
    // console.log(buttons)

    buttons.forEach(btn => {
        btn.classList.remove('btn-primary'); // active color remove
    });

    clickedBtn.classList.add('btn-primary'); // active color add
}

function filterIssues(status) {
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues'
    const clickedBtn = event.target;
    setActiveButton(clickedBtn);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            const allIssues = data.data

            let filteredIssues;

            if (status === 'all') {
                filteredIssues = allIssues;
            } else {
                filteredIssues = allIssues.filter(issue => issue.status === status);
            }

            issueContainer.innerHTML = '';
            displayAllIssues(filteredIssues);
        })



}

// loader issues

const showLoader = () => {
    document.getElementById('loader').classList.remove('hidden')

}
const hideLoader = () => {
    document.getElementById('loader').classList.add('hidden')

}




const loadAllIssues = () => {
    showLoader();

    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues'

    fetch(url)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            hideLoader();
            displayAllIssues(data.data)
        })



}

const displayAllIssues = (array) => {

    issueContainer.innerHTML = '';

    issueNumber.innerText= array.length
    // console.log(array)
    array.forEach((issue) => {
        const bdDate = new Date(issue.createdAt).toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka"
        });
        const iss = document.createElement('div');


        const borderColor = issue.status === "open" 
            ? "border-green-500" 
            : "border-purple-500";
        
       

        // console.log(issue)
        iss.innerHTML = `
        <div id="card" onclick="loadSingleIssue(${issue.id})" class=" h-full space-y-4 shadow-md border-t-4  ${borderColor} p-5 rounded-md">
                    <div class="flex justify-between">
                        <div><img src="assets/Open-Status.png" alt=""></div>
                        <div class="badge badge-warning">${issue.priority}</div>
                    </div>
                    <h2 class="text-xl font-medium">${issue.title}</h2>
                    <p>${issue.description}</p>
                    <div  class="flex justify-start  gap-4">
                      ${createElements(issue.labels)}
                    </div>
                    <hr>
                    <div>
                        <p>${issue.author}</p>
                        <p>${bdDate}</p>
                    </div>


                </div>
        `

        issueContainer.appendChild(iss)
    })

}
loadAllIssues();

// modal load and display

const loadSingleIssue = async (id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    const res = await fetch(url)
    const details = await res.json()
    displaySingleIssue(details.data)

}
const displaySingleIssue = (issue) => {

    const bdDate = new Date(issue.createdAt).toLocaleString("en-BD", {
        timeZone: "Asia/Dhaka"
    })

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
          <h2 class="text-xl font-medium">${issue.title}</h2>
                        <div class="space-y-4">
                        <div class="flex gap-4 text-center">
                            <div class="badge badge-warning"> ${issue.status}ed by </div>
                            <ul class="flex gap-5">
                                <li> ${issue.author}</li>
                                <li>${bdDate}</li>
                            </ul>
                            </div>

                            <div class="flex gap-5">
                             ${createElements(issue.labels)}
                              
                            </div>

                            <p>${issue.description}</p>

                            <div class="flex justify-around bg-gray-300 rounded-md space-y-4">
                                <div>
                                    <p>Assignee:</p>
                                    <h2>${issue.assignee}</h2>
                                </div>
                                <div>
                                    <p>Priority:</p>
                                    <div class="badge badge-warning">${issue.priority}</div>

                                </div>
                            </div>
                        </div>
        
        `

    document.getElementById('my_modal').showModal();

}

const displaySearch = async () => {

    const searchText = document.getElementById('input-search').value;

    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;

    const res = await fetch(url);
    const data = await res.json();



    displayAllIssues(data.data);
}







