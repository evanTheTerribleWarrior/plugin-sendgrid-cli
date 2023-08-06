const API_PATHS = {
    API_KEYS: '/v3/api_keys',
    SCOPES: '/v3/scopes',
    USER_SETTINGS: '/v3/user/settings',
    DOMAINS: '/v3/whitelabel/domains',
    IPS: '/v3/whitelabel/ips',
    LINKS: '/v3/whitelabel/links',
    SUBUSERS: '/v3/subusers',
    IP_ACCESS_MANAGEMENT: '/v3/access_settings',
    EVENT_WEBHOOK: '/v3/user/webhooks/event',
    PARSE_WEBHOOK: '/v3/user/webhooks/parse',
    SUPPRESSION_GROUPS: '/v3/asm/groups',
    SUPPRESION: '/v3/asm/suppressions',
    IP_WARMUP: '/v3/ips/warmup',
    IP_POOLS: '/v3/ips/pools',
    IP: '/v3/ips',
    MAIL_SETTINGS: '/v3/mail_settings',
    PARTNER_SETTINGS: '/v3/partner_settings',
    TEAMMATES: '/v3/teammates',
    INVALID_EMAIL: '/v3/suppression/invalid_emails',
    BOUNCES: '/v3/suppression/bounces',
    BLOCKS: '/v3/suppression/blocks',
    SPAM_REPORTS: '/v3/suppression/spam_reports',
    SSO_CERTIFICATES: '/v3/sso/certificates',
    SSO_INTEGRATIONS: '/v3/sso/integrations',
    SSO_TEAMMATES: '/v3/sso/teammates'
}

module.exports = API_PATHS