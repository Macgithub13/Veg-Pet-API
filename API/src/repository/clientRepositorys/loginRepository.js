import connection from "../connection.js";

export async function login(emailCPF,senha) {
    const comando = `Select         
        DS_EMAIL    as Email,
        DS_CPF        as CPF,
        DS_SENHA     as Senha
        from TB_CLIENTE
        Where DS_EMAIL=?  OR DS_CPF=?
        AND ds_senha=?`
            
    const [linhas] = await connection.query(comando,  [emailCPF, emailCPF,senha]);

    return linhas;  
}