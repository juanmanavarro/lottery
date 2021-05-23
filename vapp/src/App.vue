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
  <div style="max-width:800px" class="mx-auto mt-20">
    <h1>Loteria de Navidad Dapp</h1>
  </div>
  <div style="max-width:800px" class="pt-20 mx-auto">
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
            <h3>Your numbers</h3>
            <div class="flex flex-wrap">
              <code
                v-for="num in purchasedNumbers"
                :key="num"
                class="number"
                :class="{ 'border-red-500': numbers.includes(num) }"
              >{{ num }}</code>
            </div>
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
import { ethers } from "ethers";
import contract from './contract';

export default {
  name: 'app',
  data() {
    return {
      number: '',
      numbers: [],
      account: null,
      balance: 0,
      contract: contract,
      totalBalance: 0,
      userNumbers: [],
    }
  },
  computed: {
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
        this.totalBalance = ethers.utils.formatEther(await this.contract.getTotalBalance());
        this.userNumbers = await this.contract.getUserNumbers();
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
  async mounted() { this.connectWallet() },
}
</script>
