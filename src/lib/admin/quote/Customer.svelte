<script>
  export let user;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-5 py-5">
  <div>
    <div class="text-sm text-gray-400">Name</div>
    <div class="mb-5">{user.first_name} {user.last_name}</div>
    <div class="text-sm text-gray-400">Contact</div>
    <div class="mb-5">
      {user.email}<br />
      {user.phone}
    </div>
  </div>
  <div>
    <div class="text-sm text-gray-400">Address</div>
    <div class="mb-5">
      {@html user.address_1 ? `${user.address_1},<br>` : ""}
      {@html user.address_2 ? `${user.address_2},<br>` : ""}
      {@html user.postcode ? `${user.postcode}` : ""}
      {@html user.city ? `${user.city},<br>` : ""}
      {@html user.state ? `${user.state}` : ""}
      {@html user.country ? `${user.country}` : ""}
    </div>
  </div>
</div>
