from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import numpy as np
import re


def count_words(s):
    return len(s.split(' '))


def filter_by_length(df, threshold):
    document_words = np.array([count_words(d) for d in df['documents']])
    return df.iloc[document_words >= threshold].reset_index(drop=True)


def get_similarity(corpus):
    vect = TfidfVectorizer(min_df=1, stop_words="english")
    tfidf = vect.fit_transform(corpus)
    pairwise_similarity = tfidf * tfidf.T
    return pairwise_similarity.toarray()


def discard_similar(df, threshold):
    pairwise_similarity = get_similarity(list(df['documents']))
    n = len(pairwise_similarity)
    discard_indices = set()
    for i in range(n):
        if i in discard_indices:
            continue
        for j in range(i+1, n):
            if pairwise_similarity[i][j] > threshold:
                discard_indices.add(j)
    retain_indices = list(set(np.arange(n)) - discard_indices)
    return df.iloc[retain_indices].reset_index(drop=True)


def filter_redundant_documents(df):
    length_filtered_df = filter_by_length(df, threshold=5)
    similarity_filtered_df = discard_similar(length_filtered_df, threshold=0.9)
    return similarity_filtered_df


def get_filtered_content(df):
    # TODO: SEND JSON [{content, link}...]
    filtered_df = filter_redundant_documents(df)
    # content = '\n'.join(filtered_df['documents'])
    # content = re.sub(r'\n+', '\n', content).strip()
    return filtered_df.to_dict(orient='records')
