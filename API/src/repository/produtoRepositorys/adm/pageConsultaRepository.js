import connection from "../../connection.js";

// Comandos de consulta adm
export async function consultarProdutos(filtro){

    let comandoBase=`    
            Select 
                TB_PRODUTO.ID_produto       as ID,
                DS_imagem                   as Capa,
                TB_PRODUTO.id_categoria     as Categoria_ID,
                DS_categoria                as Categoria,
                NM_produto                  as Nome,
                TB_PRODUTO.id_animal        as Animal_ID,
                NM_animal                   as Animal,
                ds_produto                  as Descrição,
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

                    Inner join TB_IMAGEM
                        ON TB_PRODUTO.ID_produto=TB_IMAGEM.ID_produto
                    Inner Join TB_CATEGORIA
                        ON TB_PRODUTO.ID_categoria=TB_CATEGORIA.ID_categoria
                    Inner Join TB_ANIMAL
                        ON TB_PRODUTO.ID_animal=TB_ANIMAL.ID_animal
                    Inner Join TB_LOGIN_ADM
						ON	TB_PRODUTO.ID_adm=TB_LOGIN_ADM.ID_adm

                        Where NR_posicao=1 `;

    let comandoCondicao=``;
    if(filtro.semEstoque){

        comandoCondicao=comandoCondicao+` and nr_qntdEstoque=0 `
    }                        
    
    if(filtro.naoLancados){

        comandoCondicao=comandoCondicao+` and bt_disponivel=false `;
    }

    if(filtro.semLancamento){

        comandoCondicao=comandoCondicao+` and DATE(dt_lancamento)='2099-01-01' `
    }
    
    if(filtro.porCategoria){

        let puxarIDCategoria=[];

        puxarIDCategoria.push(filtro.categoria);

        comandoCondicao=comandoCondicao+` and TB_PRODUTO.id_categoria=${filtro.categoria}`;
    }

    if(filtro.porAnimal){

        let puxarIDAnimal=[];

        puxarIDAnimal.push(filtro.animal);

        comandoCondicao=comandoCondicao+` and TB_PRODUTO.id_animal=${filtro.animal}`;
    }

    if(filtro.porAdministrador){

        let puxarIDAdm=[];

        puxarIDAdm.push(filtro.adm);

        comandoCondicao=comandoCondicao+` and TB_LOGIN_ADM.id_adm=${filtro.adm}`;
    }

    if(filtro.cadastroEspecifico){

        const dataEspecificada = new Date(filtro.dataEspecifica); 

        const dataFormatada = dataEspecificada.toISOString().split('T')[0];

        comandoCondicao=comandoCondicao+` and dt_cadastro='${dataFormatada}'`;
    }

    if(filtro.produtoEspecifico){

        const puxarProduto=[];

        puxarProduto.push(filtro.produto);

        comandoCondicao=comandoCondicao+` and nm_produto like('%${puxarProduto[0]}%') OR TB_PRODUTO.id_produto like('%${puxarProduto[0]}%')`;
    }

    let comandoOrder=`ORDER BY `;
    let contarPosicoes=0;
    let colunas=[];

    if(filtro.maisVendidos){

        colunas[contarPosicoes]=`NR_vendas desc`;

        contarPosicoes=contarPosicoes+1;
    }

    if(filtro.melhorAvaliados){

        colunas[contarPosicoes]=`VL_avaliacao desc`;

        contarPosicoes=contarPosicoes+1;
    }

    if(filtro.maisFavoritados){

        colunas[contarPosicoes]=`QTD_favoritos desc`;

        contarPosicoes=contarPosicoes+1;
    }

    if(filtro.menorEstoque){

        colunas[contarPosicoes]=`NR_qntdEstoque asc`;
        comandoCondicao=comandoCondicao+` and NR_qntdEstoque!=0 `;

        contarPosicoes=contarPosicoes+1;
    }

    if(filtro.maisRecentes){

        colunas[contarPosicoes]=`dt_cadastro asc`;

        contarPosicoes=contarPosicoes+1;
    }

    for(let item of colunas){

        if(item!==colunas[colunas.length-1] && item!=undefined){

            comandoOrder=comandoOrder+item+','
        }

        else{

            comandoOrder=comandoOrder+item
        }
    }

    // Caso nenhum dos valores anteriores seja true, seta o comandoOrder como sendo vazio para não dar erro
    if(comandoOrder=='ORDER BY '){

        comandoOrder='';
    }

    // #Filtro de quantidade em estoque não pode estar ativo junto do filtro de estoque=0`;
    let command=comandoBase+comandoCondicao+comandoOrder;

    const [resp]=await connection.query(command,[filtro.semEstoque,filtro.naoLancados,filtro.semLancamento,filtro.porCategoria, filtro.categoria,filtro.porAnimal,filtro.animal,filtro.porAdministrador,filtro.adm,filtro.cadastroEspecifico,filtro.dataEspecifica,filtro.produtoEspecifico,filtro.produto,filtro.maisVendidos,filtro.maisFavoritados,filtro.menorEstoque,filtro.maisRecentes]);

    return resp;
}