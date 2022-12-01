import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    setDoc,
    doc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// 日時をいい感じの形式にする関数
function convertTimestampToDatetime(timestamp) {
    const _d = timestamp ? new Date(timestamp * 1000) : new Date();
    const Y = _d.getFullYear();
    const m = (_d.getMonth() + 1).toString().padStart(2, '0');
    const d = _d.getDate().toString().padStart(2, '0');
    const H = _d.getHours().toString().padStart(2, '0');
    const i = _d.getMinutes().toString().padStart(2, '0');
    const s = _d.getSeconds().toString().padStart(2, '0');
    return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

//作業ハートを登録する
$('#register').on('click', function () {
    //オブジェクト形式にする
    const postData = {
        work: $('#work_content').val(),
        decrease_of_heart: $('#decrease_of_heart').val(),
        time: serverTimestamp(),
    };

    //どこになにをおくるのか
    addDoc(collection(db, "my_heart_decrease"), postData);
    $('#work_content').val('');
    $('#decrease_of_heart').val('');

})


//総合ハートの取得する 完了
const docRef = doc(db, "my_heart","2tsujCrhJSttVgNMp1pC");
const docSnap = await getDoc(docRef);
let Comprehensive_heart = docSnap.data()
console.log(Comprehensive_heart.number_of_heart)

//使用するハート数を取得する
const q_mhd = query(collection(db, "my_heart_decrease"), orderBy('time', 'asc'))

onSnapshot(q_mhd, (querySnapshot) => {


    //入れる配列準備
    const documents = []

    //回して配列にいれる、使える状態にする
    querySnapshot.docs.forEach(function (doc) {
        const document = {
            id: doc.id,
            data: doc.data(),
        };
        documents.push(document);
    })


    //画面を表示するために配列に入れる
    //時間系列の関数をいれてあげる
    const htmlElements = [];
    documents.forEach(function (document) {
        htmlElements.push(`
  
            ${document.data.decrease_of_heart}
    
             `);
    });

    //配列の一番新しいものを引き抜く
    const shin = htmlElements.slice(-1)[0]
    let decrase_number = Number(shin)
    console.log(decrase_number)
    $('#clickcount').text(decrase_number)
});

//更新
$('#update').on("click", function () {
    // location.href = '/html/list.html'
    total_heart()
})

function total_heart() {
    const t_h = $('#clickcount').text()
    const postData = {
        number_of_heart: t_h,
        time: serverTimestamp(),
    };

    //どこになにをおくるのか
    addDoc(collection(db, "my_heart"), postData);
}
















//クエリの作成  変数qを作成する, queryの挙動があまりわからん
//orderByでならびかえ
//timeはfirebaseのコレクションの名前になるのか
// const q = query(collection(db, "chat"), orderBy('time', 'desc'))

// onSnapshot(q, (querySnapshot) => {
//     console.log('単純に取得した状態のコンソール', querySnapshot.docs)

//     //入れる配列準備
//     const documents = []

//     //回して配列にいれる、使える状態にする
//     querySnapshot.docs.forEach(function (doc) {
//         const document = {
//             id: doc.id,
//             data: doc.data(),
//         };
//         documents.push(document);
//     })

//     console.log('使える状態の配列になるか確かめのコンソール', documents);


//     //画面を表示するために配列に入れる
//     //時間系列の関数をいれてあげる
    
//     const htmlElements = [];
//     documents.forEach(function (document) {
//         htmlElements.push(`
//       <li id="${document.id}">
//       <p>${document.data.name} at ${convertTimestampToDatetime(document.data.time.seconds)}</p>
//       <p>${document.data.text}</p>
//       <p>${document.data.gaku}</p>
//     </li>
//         `);
//     });

//     $("#output").html(htmlElements);

// });
