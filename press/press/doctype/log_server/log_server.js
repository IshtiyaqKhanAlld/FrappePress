// Copyright (c) 2021, Frappe and contributors
// For license information, please see license.txt

frappe.ui.form.on('Log Server', {

	refresh: function (frm) {
		[
			[__('Ping Agent'), "ping_agent", false, frm.doc.is_server_setup],
			[__('Ping Ansible'), "ping_ansible", true],
			[__('Ping Ansible Scaleway'), "ping_ansible_scaleway", true, frm.doc.provider === "Scaleway"],
			[__('Update Agent'), "update_agent", true, frm.doc.is_server_setup],
			[__('Prepare Scaleway Server'), "prepare_scaleway_server", true, !frm.doc.is_server_setup && frm.doc.provider === "Scaleway"],
			[__('Setup Server'), "setup_server", true, !frm.doc.is_server_setup],
			[__('Fetch Keys'), "fetch_keys", false, frm.doc.is_server_setup && (!frm.doc.frappe_public_key || !frm.doc.root_public_key)],
		].forEach(([label, method, confirm, condition]) => {
			if (typeof condition === "undefined" || condition) {
				frm.add_custom_button(
					label,
					() => {
						if (confirm) {
							frappe.confirm(
								`Are you sure you want to ${label.toLowerCase()}?`,
								() => frm.call(method).then((r) => {
									if (r.message) {
										frappe.msgprint(r.message);
									} else {
										frm.refresh();
									}
								})
							);

						} else {
							frm.call(method).then((r) => {
								if (r.message) {
									frappe.msgprint(r.message);
								} else {
									frm.refresh();
								}
							})
						}
					},
					__('Actions')
				);
			}
		});
	}
});