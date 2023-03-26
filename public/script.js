$(document).ready(function () {
    $('#movieTable').DataTable();
});

function sendMail(index){
    console.log(movieList[index])
    //jquery ajax call we are making / api call 
    $.post('http://localhost:6001/sendMail',movieList[index],(data,status)=>{
        console.log(`Data:${data} status${status}`)
    })
}