<template>
  <div>
    <p v-if="name !== null">
      Hello {{ name }}
    </p>

    <br /><br />

    <input type="text" v-model="newBoardName" />
    <button @click="onNewBoardClk">New Request</button>

    <br /><br />
    
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
      newBoardName: "My new request",
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
      if(!this.newBoardName || this.newBoardName === "") return;
      while(!ctx) await this.wait(200);

      let mutStr;
      let res;

      mutStr = `mutation { create_board (board_name: "${this.newBoardName}", board_kind: private) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      let newBoardId = res.data.create_board.id;

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Specifications", column_type: long_text) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Units", column_type: dropdown) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Quantity", column_type: numbers) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Rate", column_type: numbers) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Budget", column_type: numbers) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "People", column_type: people) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Sample Images", column_type: integration) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Attachments", column_type: integration) { id } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      mutStr = `mutation { create_column (board_id: ${newBoardId}, title: "Status", column_type: status) { id } }`;
      res = await this.monday.api(mutStr);
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
