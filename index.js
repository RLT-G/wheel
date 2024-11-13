let wheelCount = 0;
let user_id, link, earned_count, invited_count, rotation_count, balance, username, refer; 
let isRotating = false;


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
    if (isRotating) return;
    isRotating = true;
    const wheel = document.querySelector('.wheel__wrapper');
    wheel.style.transform = `rotate(${degrees}deg)`;
    setTimeout(() => isRotating = false, 17000);
}


const setSlice = (sliceIndex) => {
    const sliceDegrees = [18, -22, -62, -102, -142, -182, -222, -262, -302];
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


const openPopup = (msg) => {
    document.querySelector('.popup').classList.add('active');
    insertData(msg, 'popup__content_text');
    document.body.style.overflow = 'hidden';
}


const closePopup = () => {
    document.querySelector('.popup').classList.remove('active');
    document.body.style.overflow = '';
}


const getSliceIndex = async (id) => {
    const response = await fetch("https://itkaba.xyz/api/index", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: user_id })
    });

    const data = await response.json();
    if (data.sliceIndex === undefined || data.sliceIndex === null) {
        openPopup("У вас недостаточно вращений. Пригласи друга - получи вращение!");
        return null;
    }
    return data.sliceIndex;
};


const getUserStats = async (user_id) => {
    try {
        const response = await fetch("https://itkaba.xyz/api/user_stats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: user_id })
        });

        const data = await response.json();

        if (data.status === "ok" && data.data) {
            earned_count = data.data.earned_count != undefined ? data.data.earned_count : 0;
            invited_count = data.data.invited_count;
            rotation_count = data.data.rotation_count;
            balance = data.data.balance;
        } else {
            console.error("Failed to retrieve user stats:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return null;
    }
};


const updateData = async () => {
    await getUserStats(user_id);
    insertData(`${String(link)}`, 'link')
    insertData(`Заработано: ${String(balance)}₽`, 'earned_count')
    insertData(`Приглашено: ${String(invited_count)}`, 'invited_count')
    insertData(`Вращений: ${String(rotation_count)}`, 'rotation_count')
    insertData(`Баланс: ${String(balance)}₽`, 'balance')
    insertData(String(username), 'username')
    insertData(String(refer) === '0' ? 'Пришел от: —' : `Пришел от: ${String(refer)}`, 'refer')
}


const init = async () => {
    const initValue = getParams("d");
    console.log(initValue)
    if (initValue){
        user_id = initValue.user_id;
        link = initValue.link; 
        // earned_count = initValue.earned_count === "False" ? initValue.earned_count : 0
        invited_count = initValue.invited_count; 
        rotation_count = initValue.rotation_count; 
        balance = initValue.balance
        username = initValue.username; 
        refer = initValue.refer; 
    }
    await updateData();

    document.querySelector('.wheel')
        .addEventListener('click', async () => {
            const sliceIndex = await getSliceIndex();
            // const sliceIndex = 0;
            if (sliceIndex != null && sliceIndex !=undefined) {
                setSlice(sliceIndex);
                let amount = [15, 100, 5, 25, 250, 10, 50, 500, 1] 
                setTimeout(() => {
                    openPopup(`Поздравляем, вы получили ${amount[sliceIndex]}₽`)
                    earned_count = Number(earned_count) + amount[sliceIndex]
                    balance = Number(balance) + amount[sliceIndex]
                    rotation_count -= 1
                    updateData();
                }, 17000);
            }
    })

    document.querySelector('.close_popup')
        .addEventListener('click', () => {
            closePopup();
    })

    document.querySelector('.popup')
        .addEventListener('click', (event) => {
            if (!document.querySelector('.popup__content').contains(event.target)) {
                closePopup();
            }
    });
    
    document.querySelector('.links__btn')
        .addEventListener('click', () => {
            navigator.clipboard.writeText(link)
            document.querySelector('.links__btn').classList.add('click')
            insertData("Ссылка скопирована", 'links__btn')
            setTimeout(() => {
                insertData("Пригласи друга - Получи вращение!", 'links__btn')
                document.querySelector('.links__btn').classList.remove('click')
            }, 5000)
        })

    document.querySelector('.info__btn-1')
        .addEventListener('click', () => {
            window.location.href = 'https://teletype.in/@omega_gpt/omega_roulette';
    })

    document.querySelector('.info__btn-2')
        .addEventListener('click', () => {
            window.location.href = 'https://t.me/lolo_key';
    })

    document.querySelector('.withdrawal__btn')
        .addEventListener('click', () => {
            window.location.href = 'https://t.me/lolo_key';
    })

}


init();