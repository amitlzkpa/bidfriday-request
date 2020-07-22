<template>
  <div>
    <p v-if="name !== null">
      Hello {{ name }}
    </p>
    <button @click="onNewBoardClk">New Board</button>
    <button @click="onViewBoardClk">Show Board Items</button>
    <p v-for="row in rows" :key="row.name">
      {{ row.name }}
    </p>
  </div>
</template>

<script>

let ctx;

export default {
  data () {
    return {
      name: null,
      rows: []
    };
  },
  async mounted () {
    let res = await this.monday.api('query { me { name } }');
    this.name = res.data.me.name;

    this.monday.listen("context", async (res) => {
      ctx = res.data;
    });

  },
  methods: {
    async onNewBoardClk() {
      while(!ctx) await this.wait(200);

      let mutStr = `mutation { create_board (board_name: "my board", board_kind: public) { id } }`;
      console.log(mutStr);
      let res = await this.monday.api(mutStr);
      console.log(res.data);

    },
    async onViewBoardClk() {
      while(!ctx) await this.wait(200);

      let boardId = ctx.boardId;
      let queryStr = `query { boards (ids: ${boardId}) { name items { name } } }`;
      console.log(queryStr);
      let res = await this.monday.api(queryStr);
      console.log(res.data);
      this.rows = res.data.boards[0].items;
    }
  }
}
</script>

<style scoped>
</style>
