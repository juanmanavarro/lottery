<template>
<div>
  <div class="flex justify-end">
    <button v-if="account" @click="disconnectWallet">
      {{ balance }} ETH
    </button>
    <button v-else @click="connectWallet">
      <span>Connect wallet</span>
    </button>
  </div>
  <div style="max-width:800px" class="pt-40 mx-auto">
    <div v-if="isConnected" id="app">
      <div class="card">
        <h4>Total</h4>
        <h2 class="-mt-3">{{ totalBalance }} ETH</h2>
      </div>
      <div class="card">
        <div class="flex">
          <div class="w-1/2">
            <h4>Search number</h4>
            <input class="inline-block" v-model="number" type="text" maxlength="5">
            <button @click="add" :disabled="!canAdd">Add</button>
            <div v-if="numbers.length" class="mt-10">
              <code
                v-for="num in numbers"
                :key="num"
                class="number"
                :class="{ 'border-red-500': numbers.includes(num) }"
              >{{ num }}</code>
            </div>
            <div class="mt-10" v-if="numbers.length">
              <button @click="purchase">Purchase</button>
            </div>
          </div>
          <div class="w-1/2">
            <pre>{{ purchasedNumbers }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      Check metamask
    </div>
  </div>
</div>
</template>

<script>
// import { mapState } from 'vuex';
import { ethers } from "ethers";

export default {
  name: 'app',
  data() {
    return {
      number: '',
      numbers: [],
      account: null,
      accounts: [],
      balance: 0,
      provider: null,
      connected: false,
      contract: null,
      totalBalance: 0,
      userNumbers: [],
    }
  },
  computed: {
    // ...mapGetters('drizzle', ['isDrizzleInitialized']),
    // ...mapState('accounts', ['activeAccount', 'activeBalance']),
    canAdd() {
      return this.number.length === 5 && !this.numbers.includes(this.number);
    },
    isConnected() {
      return Boolean(this.account);
    },
    purchasedNumbers() {
      return this.userNumbers.map(n => n.toString());
    },
  },
  methods: {
    add() {
      this.numbers.push(this.number)
      this.number = '';
    },
    async connectWallet() {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.account = accounts[0];
        this.balance = ethers.utils.formatEther(await window.ethereum.request({
          method: 'eth_getBalance',
          params: [this.account],
        }));
      } catch (error) {
        console.error(error);
      }
    },
    async disconnectWallet() {
      this.account = null;
    },
    async purchase() {
      try {
        const res = await this.contract.functions.purchase(this.numbers, {
          value: ethers.utils.parseEther('0.001').mul(this.numbers.length),
        });
        await res.wait();
        this.totalBalance = ethers.utils.formatEther(await this.contract.getTotalBalance());
        this.numbers = [];
        this.userNumbers = await this.contract.getUserNumbers();
        this.$toasted.show('Purchase successful!', {fitToScreen: true});
      } catch (error) {
        console.error('ERROR', error);
      }
    },
  },
  async mounted() {
    this.connectWallet();

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    const address = '0x4D21ab42c0540d23f87dc622A680f489f1e18BD1';
    const daiAbi = [
      "function maxNumber() view returns (uint)",
      "function getTotalBalance() public view returns (uint)",
      "function purchase(uint[] memory _numbers) public payable",
      "function getUserNumbers() public view returns (uint[] memory)",
    ];
    const signer = this.provider.getSigner();



    // // The Contract object
    this.contract = new ethers.Contract(address, daiAbi, signer);
    this.totalBalance = ethers.utils.formatEther(await this.contract.getTotalBalance());
    this.userNumbers = await this.contract.getUserNumbers();


    // window.ethereum.on('chainChanged', async () => {
    //   const res = await window.ethereum.request({
    //     method: 'eth_getBalance',
    //     params: [this.account],
    //   });
    //   console.log(res);
    //   // this.balance = ethers.utils.formatEther();
    // });
  },
}
</script>
