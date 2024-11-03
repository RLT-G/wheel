let wheelCount = 0;


const getParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedParam = urlParams.get(param);
    if (!encodedParam) return null;
    try {
        const decodedParam = atob(encodedParam);
        const jsonObject = JSON.parse(decodedParam);
        return jsonObject;
    } catch (error) {return null;}
}


const rotateWheel = (degrees) => {
    const wheel = document.querySelector('.wheel__wrapper');
    wheel.style.transform = `rotate(${degrees}deg)`;
}


const setSlice = (sliceIndex) => {
    const sliceDegrees = [17, -23, -63, -103, -143, -183, -223, -263, -303];
    let degrees = sliceDegrees[sliceIndex] + (Math.floor(Math.random() * 15) - 7)
    if (wheelCount % 2 === 0) degrees -= 3600;
    else degrees += 3600;
    wheelCount += 1;
    rotateWheel(degrees);
}


function insertData(input, divId) {
    const div = document.getElementById(divId);
    const sanitizedInput = input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    div.textContent = sanitizedInput;
}


const getSliceIndex = async () => {
    try {
        const response = await fetch("http://192.168.1.102/api/index", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
            // body: JSON.stringify({ name: "John", age: 30 })
        });
        if (!response.ok) throw new Error("Ошибка сети: " + response.status);
        const data = await response.json();
        console.log(data.sliceIndex)
        return data.sliceIndex; 

    } catch (error) {
        return null; 
    }
}


const init = () => {
    const initValue = getParams("d");
    if (initValue){
        insertData(initValue.link, 'link')
        insertData(initValue.earned_count, 'earned_count')
        insertData(initValue.invited_count, 'invited_count')
        insertData(initValue.rotation_count, 'rotation_count')
        insertData(initValue.balance, 'balance')
        insertData(initValue.username, 'username')
        insertData(initValue.refer, 'refer')
    }

    document.querySelector('.wheel')
        .addEventListener('click', async () => {
            const sliceIndex = await getSliceIndex();
            if (sliceIndex != null && sliceIndex !=undefined) setSlice(sliceIndex);
    })
}


init();