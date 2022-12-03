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
    updateDoc,
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
    // addDoc(collection(db, "my_heart_decrease"), postData);

    //ドキュメントIDを指定して、更新する形をとった
    const docRef = doc(db, "my_heart_decrease", "5nLihgsxnifdtNP2XLcM");
    updateDoc(docRef, postData);

    $('#work_content').val('');
    $('#decrease_of_heart').val('');
    $('.text_area').val('');
    
    my_heart_get_decrase()
    
})

//リアルタイムをつぶしてしまっている
async function my_heart_get_decrase() {
    //総合ハートの取得する
    //マイハートのドキュメントを指定して、取得する（getdoc）
    const docRe = doc(db, "my_heart", "2tsujCrhJSttVgNMp1pC");
    const docSnap = await getDoc(docRe);
    let C_heart = docSnap.data()
    let Comprehensive_heart = C_heart.number_of_heart
    let Comprehensive_heart_number = Number(Comprehensive_heart)
    console.log(Comprehensive_heart_number)
  

    //使用するハートを取得する
    //my_heart_decreaseのドキュメントを指定して、取得する（getdoc）
    const decrase_c = doc(db, "my_heart_decrease", "5nLihgsxnifdtNP2XLcM");
    const docdecrase = await getDoc(decrase_c);
    let decrase_haert = docdecrase.data()
    let decrease_of_heart = decrase_haert.decrease_of_heart
    let decrease_of_heart_number = Number(decrease_of_heart)
    console.log(decrease_of_heart_number)
   

    //総合ハート - 使用するハートを表現する
    let Comprehensive_heart_number_v2 = Comprehensive_heart_number - decrease_of_heart_number
    console.log(Comprehensive_heart_number_v2)

    const my_heart_doc = doc(db, "my_heart", "2tsujCrhJSttVgNMp1pC");
    const new_data = {
        number_of_heart: Comprehensive_heart_number_v2,
        time: serverTimestamp(),
    };

    updateDoc(my_heart_doc, new_data);
}

//ハートの本体を表示
const q = query(collection(db, "my_heart"), orderBy('time', 'asc'))
onSnapshot(q, (querySnapshot) => {

    //入れる配列準備
    const C_documents = []

    //回して配列にいれる、使える状態にする
    querySnapshot.docs.forEach(function (doc) {
        const C_document = {
            id: doc.id,
            data: doc.data(),
        };
        C_documents.push(C_document);
    })

    //画面を表示するために配列に入れる
    //時間系列の関数をいれてあげる
    const C_htmlElements = [];
    C_documents.forEach(function (mh) {
        C_htmlElements.push(`
  
            ${mh.data.number_of_heart}
    
             `);
    });

    //配列の一番新しいものを引き抜く
    const Comprehensive_number = C_htmlElements.slice(-1)[0]
    var cm = Number(Comprehensive_number)
    $("#output").html(cm);
    console.log("総計ハート",cm)
});


//一覧画面に移動する
$('#move').on("click", function () {
    location.href = '/html/list.html'
})