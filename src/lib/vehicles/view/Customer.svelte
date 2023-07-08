<script>
  export let user;
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Customer Information</h2>
  </div>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="grid grid-cols-1 gap-4">
        <div>
          <div class="label">Name</div>
          <div class="value">{user.first_name || ""} {user.last_name || ""}</div>
        </div>
        <div>
          <div class="label">Contact</div>
          <div class="value break-words">
            <div class="mb-2">{user.email}</div>
            {user.phone}
          </div>
        </div>
      </div>
      <div>
        <div class="label">Address</div>
        <div class="value">
          {@html user.address_1 ? `${user.address_1},<br>` : ""}
          {@html user.address_2 ? `${user.address_2},<br>` : ""}
          {@html user.postcode ? `${user.postcode}` : ""}
          {@html user.city ? `${user.city},<br>` : ""}
          {@html user.state ? `${user.state}` : ""}
          {@html user.country ? `${user.country}` : ""}
        </div>
      </div>
    </div>
  </div>
</div>
