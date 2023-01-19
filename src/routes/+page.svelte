<script lang="ts">
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	let loading = true;
	let lastEntry: any = null;
	import { initializeApp, type FirebaseOptions } from 'firebase/app';
	import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	export let data: any;

	const firebaseConfig: FirebaseOptions = {
		apiKey: 'AIzaSyCXzsIPaDnRI3eR0Cs_kd2m7G6xpGewP3E',
		authDomain: 'are-we-bohle-yet.firebaseapp.com',
		projectId: 'are-we-bohle-yet',
		storageBucket: 'are-we-bohle-yet.appspot.com',
		messagingSenderId: '361972540185',
		appId: '1:361972540185:web:67e4cd17606a223a9fdb88'
	};

	const app = initializeApp(firebaseConfig);

	const db = getFirestore(app);

	// add document to collection
	addDoc(collection(db, 'entries'), {
		date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		isThere: data.wasJonathan
	});

	// this runs when the component mounts
	onMount(async () => {
		const snapshot = await getDocs(collection(db, 'entries'));
		const data = snapshot.docs.map((doc) => doc.data()).filter((entry) => entry.isThere);
		lastEntry = data[data.length - 1];
		loading = false;
	});
</script>

<svelte:head>
	<title>Are we bohle yet?</title>
	<meta name="description" content="Are we bohle yet?" />
</svelte:head>

<main class="bg-gray-900 w-screen h-screen flex flex-col justify-center items-center gap-4">
	<h1
		class="text-8xl font-bold"
		class:text-green-600={data.wasJonathan}
		class:text-red-500={!data.wasJonathan}
	>
		{#if data.wasJonathan}Yes{:else}No{/if}
	</h1>
	<p class="text-xl text-gray-400 max-w-[300px] text-center">
		Jonathan was{data.wasJonathan ? ' ' : ' not '}the last person at Bohlebots ©
		{#if !data.wasJonathan}
			— it was <span class="italic">{data.last}</span>
		{/if}
	</p>
	{#if !loading && !data.wasJonathan && lastEntry}
		<p class="text-lg text-gray-400 max-w-[300px] text-center">
			He was there {dayjs.duration(dayjs().diff(dayjs(lastEntry.date))).humanize()} ago
		</p>
	{/if}
</main>
