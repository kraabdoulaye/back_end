export default class VisaHelper{

    async createCard(){
        return {
            expirationDate: getExpirationDate(),
            digits: `${getRandomArbitrary(100,399)} ${getRandomArbitrary(200,600)} ${getRandomArbitrary(100,999)}`,
            cvv: getRandomArbitrary(100,999),

        }
    }
}

function getRandomArbitrary(min:number , max:number):number {
    return Math.random() * (max - min) + min;
}
function getExpirationDate():string {
    const today:Date = new Date();
    const month:number = today.getMonth();
    const year:number = today.getFullYear();
    return `${month} / ${(year + 2)}`;
}