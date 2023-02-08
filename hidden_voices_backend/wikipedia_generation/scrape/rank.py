from wikipedia_generation.utils import logger
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import re


def split_to_sentences(text, group_count=1):
    paras = [re.split('[\.|\?]\s*', para.strip()) for para in text.split('\n')]
    split_text = []
    for para in paras:
        for i in range(0, len(para), group_count):
            joined_sentences = '. '.join(
                para[i: min(len(para), i + group_count)])
            if len(joined_sentences):
                split_text.append(joined_sentences)
    return split_text


def apply_tf_idf(documents):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(documents)
    feature_names = vectorizer.get_feature_names()
    dense = vectors.todense()
    denselist = dense.tolist()
    df = pd.DataFrame(denselist, columns=feature_names)
    return df


def rank_link_documents(name, link, documents):
    df_tf_idf = apply_tf_idf(documents)
    df_ranked = pd.DataFrame()
    for n in name:
        if n in df_tf_idf.columns:
            df_ranked[n] = df_tf_idf[n]
        else:
            df_ranked[n] = [0 for _ in range(len(documents))]

    df_ranked['documents'] = documents
    df_ranked['link'] = [link for _ in range(len(documents))]
    return df_ranked


def get_ranked_documents(df, name, group_count=None):
    name = name.lower().split(" ")
    ranked_documents = []
    for i in range(len(df)):
        try:
            documents = df.iloc[i]['Content'].split(
                '\n') if group_count is None else split_to_sentences(df.iloc[i]['Content'], group_count)
            link = df.iloc[i]['Link']
            ranked_documents.append(rank_link_documents(name, link, documents))
        except Exception:
            # Exception raised when the document has no vocabulary
            # Do nothing about it
            pass

    ranked_df = pd.concat(ranked_documents).sort_values(
        by=name, ascending=False)
    ranked_df = ranked_df.reset_index().drop('index', axis=1)
    name_query = [f'{n} > 0' for n in name]
    query = ' | '.join(name_query)
    return ranked_df.query(query)
