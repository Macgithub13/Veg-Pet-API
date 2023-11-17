import connection from "../../connection.js";

export async function consultarProduto(id){

    let command = 
        `Select 
            TB_PRODUTO.ID_produto       as ID,
            TB_PRODUTO.id_categoria     as Categoria_ID,
            DS_categoria                as Categoria,
            NM_produto                  as Nome,
            TB_PRODUTO.id_animal        as Animal_ID,
            nm_animal                   as Animal,
            ds_marca                    as Marca,
            ds_produto                  as Descrição,
            ds_peso                     as Peso,
            NR_vendas                   as Vendas,
            NR_qntdEstoque              as Estoque,
            VL_preco                    as Preço,
            NR_desconto                 as Desconto,
            BT_disponivel               as Disponível,
            dt_cadastro                 as Cadastro,
            DT_lancamento               as Lançamento,
            VL_avaliacao                as Avaliação,
            qtd_avaliacoes              as Avaliações,
            QTD_favoritos               as Favoritos,
            NM_adm                      as Adm,
            TB_PRODUTO.id_adm           as Adm_ID

        from TB_PRODUTO

            Inner Join TB_CATEGORIA
                ON TB_PRODUTO.ID_categoria=TB_CATEGORIA.ID_categoria
            Inner Join TB_ANIMAL
                ON TB_PRODUTO.ID_animal=TB_ANIMAL.ID_animal
            Inner Join TB_LOGIN_ADM
                ON	TB_PRODUTO.ID_adm=TB_LOGIN_ADM.ID_adm
                
            Where TB_PRODUTO.ID_produto=?`;

    const [resp]=await connection.query(command,[id]);

    return resp;
}

export async function alterarProduto(produto,id){

    const command=`
        update TB_PRODUTO
            set nm_produto=?,
                id_categoria=?,
                id_animal=?,
                ds_marca=?,
                ds_produto=?,
                ds_peso=?,
                dt_lancamento=?,
                bt_disponivel=?,
                vl_preco=?,
                nr_desconto=?,
                nr_qntdEstoque=?

            where id_produto=?`;

    const [resp]=await connection.query(command,[produto.nome,produto.categoria,produto.animal,produto.marca,produto.descricao,produto.peso,produto.lancamento,produto.disponivel,produto.preco,produto.desconto,produto.estoque,id]);

    return resp;
}

export async function deletarProduto(id){

    const command=`
    
        DELETE from TB_PRODUTO
        WHERE id_produto=?
    `;

    const [resp]=await connection.query(command,[id]);

    return resp.affectedRows;
}