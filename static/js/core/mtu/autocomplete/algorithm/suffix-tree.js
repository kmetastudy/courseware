class SuffixTreeNode {
  constructor() {
    this.children = {};
    this.start = -1;
    this.end = -1;
  }
}

class SuffixTree {
  constructor(s) {
    this.root = new SuffixTreeNode();
    this.buildSuffixTree(s);
  }

  buildSuffixTree(s) {
    for (let i = 0; i < s.length; i++) {
      this._insertSuffix(s, i);
    }
  }

  _insertSuffix(s, index) {
    let current = this.root;
    for (let i = index; i < s.length; i++) {
      const char = s[i];
      if (!current.children[char]) {
        current.children[char] = new SuffixTreeNode();
        current.children[char].start = i;
        current.children[char].end = s.length;
      }
      current = current.children[char];
    }
  }

  // Suffix Tree를 사용하여 패턴 검색
  search(pattern) {
    let current = this.root;
    for (const char of pattern) {
      if (current.children[char]) {
        current = current.children[char];
      } else {
        return false;
      }
    }
    return true;
  }
}
