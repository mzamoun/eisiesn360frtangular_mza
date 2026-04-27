
export class Mail {
    subject : string
    msg : string
    from : string
    to : string
    cc : string
    // doc est l'equivalent de Map<String, Inputstream> pour les pieces jointes, ou de Map<String, String> pour les pieces jointes en base64
    attachments : { [key: string]: any }
}
