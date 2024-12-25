import nltk
from nltk.corpus import words, brown
from nltk.probability import FreqDist

nltk.download('words')
nltk.download('brown')

brown_words = brown.words()
freq_dist = FreqDist(brown_words)

word_list = [word for word in words.words()]
sorted_word_list = sorted(word_list, key=lambda w: freq_dist[w.lower()], reverse=True)

size = len(sorted_word_list)
lwr = int(0.01 * size)
upr = int(0.03 * size)

dict_words = sorted_word_list[lwr:upr]

with open('dictionary.txt', 'w') as dict_file:
    for word in dict_words:
        dict_file.writelines(word.lower() + '\n')

