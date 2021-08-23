<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'About',
  })
</script>

<template>
  <div id="about" class="w-full md:w-4/5 mx-auto">
		<h2>About This App</h2>
		<p>
			If you're into cooking, you might find some inspiration here 😁
		</p>
		<p>recept0r is a minimal recipes app based on vue.js and Fauna DB. It's a serverless web application making use of Netlify functions to handle all backend functionality like database access and user authentication.</p>
		<p>At the moment, recept0r is a semi-public personal service. That means, that even though public signup is technically possible, it's currently disabled in favor of an invite only signup process.</p>
		<h3 class="mb-0">Credits</h3>
    <div class="flex flex-row items-center justify-start my-4">
      <div class="w-12 h-12 flex flex-col justify-center">
        <img src="/img/sahar.svg" class="h-10 block mx-auto" alt="sahar.design">
      </div>
      <p class="ml-6 mb-0">
        <strong class="text-sm">Design</strong><br>
        Sahar Heumesser | <a href="https://sahar.design" target="_blank" rel="noopener">website</a>
      </p>
    </div>
    <div class="flex flex-row items-center justify-start my-4">
      <div class="w-12 h-12 flex flex-col justify-center">
        <img src="/img/tom.svg" class="h-10 block mx-auto" alt="ttntm.me">
      </div>
      <p class="ml-6 mb-0">
        <strong class="text-sm">Code</strong><br>
        ttntm | <a href="https://ttntm.me" target="_blank" rel="noopener">website</a>
      </p>
    </div>
		<h3>Tech Stack</h3>
		<p>recept0r is built based on these tools:</p>
		<ul>
			<li>faunadb</li>
      <li>gotrue-js (Netlify identity)</li>
			<li>tailwindcss</li>
			<li>quill Editor</li>
			<li>vue</li>
			<li>vue-router</li>
			<li>vuex</li>
		</ul>
		<p>
			The exact specifications can be found in
			<code class="bg-gray-500 p-1 rounded-md text-sm">package.json</code> at
			<a href="https://github.com/ttntm/recept0r/blob/master/package.json" target="_blank" rel="noopener">GitHub</a>
		</p>
		<p>
			Large parts of the user signup and authentication process are based on this project:
			<a href="https://github.com/chiubaca/vue-netlify-fauna-starter-kit" target="_blank" rel="noopener">vue-netlify-fauna-starter-kit</a>
		</p>
	</div>
</template>

<style lang="postcss" scoped>
  a {
    @apply text-blue-500 font-bold underline;
  }
  a:hover {
    @apply no-underline;
  }
</style>