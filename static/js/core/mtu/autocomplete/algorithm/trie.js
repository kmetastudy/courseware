class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
  }

  search(word) {
    let current = this.root;
    for (const char of word) {
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    return current !== null && current.isEndOfWord;
  }

  // 사용자의 입력에 따라 자동완성 제안을 생성하는 함수
  autocomplete(prefix) {
    let current = this.root;
    for (const char of prefix) {
      if (!current.children[char]) {
        return [];
      }
      current = current.children[char];
    }
    return this._findWords(current, prefix);
  }

  _findWords(node, prefix) {
    let results = [];
    if (node.isEndOfWord) {
      results.push(prefix);
    }
    for (const [char, childNode] of Object.entries(node.children)) {
      results = results.concat(this._findWords(childNode, prefix + char));
    }
    return results;
  }
}
