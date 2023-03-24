export function ConvertFormatRupiah(number){
    return new Intl.NumberFormat('id-ID', {minimumFractionDigits: 0, style: 'currency', currency: 'IDR' }).format(number)
}

export function ConvertFormatDate(date){
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour: '2-digit', minute: '2-digit', second: '2-digit' };
    let transDate  = new Date(date);
    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(transDate)
    console.log("Tanggal",formattedDate)
    return formattedDate//date.toString("en-US",options)
}