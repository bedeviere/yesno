var wrapper = document.getElementsByClassName('wrapper')[0];
var askerVM = new Vue({
  el: '#asker',
  data: {
    question: '',
    helper: 'Ask me anything. Don\'t forget the question mark (?)',
    answer: '',
    image: ''
  },
  watch: {
    // whenever question changes, this function will run
    question: function (newQuestion, oldQuestion) {
      this.helper = 'Waiting for you to stop typing...';
      wrapper.classList.remove('dark');
      this.answer = '';
      this.image = '';
      this.debouncedGetAnswer();
    }
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 1000);
  },
  methods: {
    getAnswer:  function () {
      if (this.question === '') {
        wrapper.classList.remove('dark');
        this.answer = '';
        this.helper = 'Just ask. Don\'t be shy :)';
        this.image = '';
        return
      } else if (this.question.indexOf('?') === -1) {
        wrapper.classList.add('dark');
        this.answer = '';
        this.helper = 'Question mark not found???';
        this.image = 'img/what.jpg';
        return
      }
      this.helper = 'Thinking...';
      wrapper.classList.remove('dark');
      this.answer = '';
      this.image = '';
      var vm = this;
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          wrapper.classList.remove('dark');
          vm.answer = _.capitalize(response.data.answer);
          vm.image = _.capitalize(response.data.image);
          vm.helper = 'Have another question? Ask again';
        })
        .catch(function (error) {
          wrapper.classList.remove('dark');
          vm.answer = '';
          vm.helper = 'Error! Could not reach the API. ' + error;
          vm.image = '';
        })
    }
  }
})